// main.js
// Core logic for the AI Skin Retouch Pro UXP Plugin

// 1. UXP and Photoshop API IMPORTS
const { app } = require("photoshop");
const { core, action } = require("photoshop");
const uxp = require("uxp");
const { localFileSystem } = uxp.storage;

// 2. BACKEND CONFIGURATION
// This URL now points to your live backend on Render.
const BACKEND_URL = "https://ai-skin-retouch-pro-ph-plugin.onrender.com/retouch";

// 3. UI ELEMENT REFERENCES
const retouchBtn = document.getElementById("retouchBtn");
const statusText = document.getElementById("status");

/**
 * Updates the status text in the UI panel.
 * @param {string} message The message to display.
 * @param {('info'|'error'|'success')} type The type of message for styling.
 */
function updateStatus(message, type = "info") {
  statusText.textContent = message;
  statusText.className = "status-text"; // Reset classes
  if (type === "error") {
    statusText.classList.add("error");
  } else if (type === "success") {
    statusText.classList.add("success");
  }
}

/**
 * Disables or enables the main action button.
 * @param {boolean} disabled True to disable, false to enable.
 */
function setButtonDisabled(disabled) {
  retouchBtn.disabled = disabled;
}

/**
 * Main function to perform the skin retouching process.
 */
async function performRetouch() {
  // Use a single execution context for all Photoshop interactions
  await core.executeAsModal(async (executionContext) => {
    const hostControl = executionContext.hostControl;
    const suspensionID = await executionContext.suspendHistory({
      documentID: app.activeDocument.id,
      name: "AI Skin Retouch",
    });

    try {
      setButtonDisabled(true);
      updateStatus("Starting process...");

      // 4. CHECK FOR ACTIVE DOCUMENT AND LAYER
      if (!app.activeDocument) {
        throw new Error("No active document. Please open an image.");
      }
      const activeLayers = app.activeDocument.activeLayers;
      if (activeLayers.length === 0) {
        throw new Error("No layer selected. Please select a layer to retouch.");
      }
      
      const layer = activeLayers[0];

      // 5. EXPORT THE ACTIVE LAYER AS JPEG
      updateStatus("Exporting selected layer...");
      const tempFolder = await localFileSystem.getTemporaryFolder();
      const tempFile = await tempFolder.createFile("temp_layer.jpg", { overwrite: true });
      const saveToken = localFileSystem.createSessionToken(tempFile);

      // This command saves a flattened copy of the specified layer to a temp file
      const saveCommand = {
        _obj: "save",
        as: {
          _obj: "jpeg",
          extended: true,
          matte: { _enum: "matteColor", _value: "none" },
          quality: 12,
        },
        in: { _path: saveToken, _kind: "local" },
        documentID: app.activeDocument.id,
        copy: true, 
        layer: { _id: layer.id },
        _options: { dialogOptions: "never" },
      };
      
      await action.batchPlay([saveCommand], {});
      
      // 6. READ FILE AND SEND TO BACKEND
      updateStatus("Sending image to AI backend...");
      const imageBytes = await tempFile.read({ format: uxp.storage.formats.binary });

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        body: imageBytes,
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Length": imageBytes.length,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend Error: ${response.status} - ${errorText}`);
      }
      
      updateStatus("AI processing complete. Receiving image...");
      const processedImageBytes = await response.arrayBuffer();

      // 7. IMPORT THE PROCESSED IMAGE BACK INTO PHOTOSHOP
      updateStatus("Importing retouched layer...");
      const processedFile = await tempFolder.createFile("processed_layer.jpg", { overwrite: true });
      await processedFile.write(processedImageBytes, { format: uxp.storage.formats.binary });
      const placeToken = localFileSystem.createSessionToken(processedFile);

      // This command places the retouched image as a new smart object layer
      const placeCommand = {
        _obj: "placeEvent",
        target: {
          _path: placeToken,
          _kind: "local",
        },
        linked: false,
      };

      await action.batchPlay([placeCommand], {});
      
      updateStatus("✨ Done! New retouched layer added.", "success");

    } catch (error) {
      console.error(error);
      updateStatus(`Error: ${error.message}`, "error");
    } finally {
      // Resume history state whether it succeeded or failed
      await executionContext.resumeHistory(suspensionID);
      setButtonDisabled(false);
    }
  }, { commandName: "Running AI Skin Retouch" });
}

// 8. ATTACH EVENT LISTENER
retouchBtn.addEventListener("click", performRetouch);