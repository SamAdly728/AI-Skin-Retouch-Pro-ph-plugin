# AI Skin Retouch Pro: Deployment and Sales Guide

Congratulations on building the AI Skin Retouch Pro plugin! This guide will walk you through deploying the Python backend to a live server, configuring the plugin, packaging it for customers, and getting it ready for sale on a platform like Gumroad.

## Table of Contents
1. [Part 1: Deploying the Python Backend to Render](#part-1-deploying-the-python-backend-to-render)
2. [Part 2: Configuring the Photoshop Plugin](#part-2-configuring-the-photoshop-plugin)
3. [Part 3: Packaging the Plugin for Distribution (`.ccx` file)](#part-3-packaging-the-plugin-for-distribution-ccx-file)
4. [Part 4: Selling on Gumroad](#part-4-selling-on-gumroad)

---

### Part 1: Deploying the Python Backend to Render

We will use [Render](https://render.com/) to host our Python backend. They offer a free tier that is perfect for this project.

#### Step 1: Prepare Your Code
1.  **Create a GitHub Repository**: If you haven't already, create a new GitHub repository and push your entire project (`ai-skin-retouch-pro` folder and its contents) to it. Render will connect to this repository.

#### Step 2: Set Up the Web Service on Render
1.  **Sign Up**: Create a free account on [Render.com](https://render.com/).
2.  **Create a New Web Service**:
    *   From your Render Dashboard, click **New +** > **Web Service**.
    *   Connect your GitHub account and select the repository you just created.
3.  **Configure the Service**:
    *   **Name**: Give your service a unique name (e.g., `ai-skin-retouch-pro`). This will be part of your URL.
    *   **Root Directory**: Set this to `ai-skin-retouch-pro/backend`. This tells Render to only look inside the `backend` folder.
    *   **Environment**: Select `Python 3`.
    *   **Region**: Choose a region close to you.
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4.  **Select an Instance Type**:
    *   Choose the **Free** instance type.
5.  **Deploy**:
    *   Click **Create Web Service**. Render will now pull your code from GitHub, install the dependencies, and start the server. The first deployment might take a few minutes.

#### Step 3: Get Your Live URL
*   Once the deployment is complete and the status is "Live", Render will provide you with a public URL at the top of the page. It will look like this:
    `https://your-app-name.onrender.com`

**Your backend is now live!** Keep this URL handy for the next step.

---

### Part 2: Configuring the Photoshop Plugin

Now, we need to tell the Photoshop plugin where to find its live backend.

1.  **Open `main.js`**: Navigate to `ai-skin-retouch-pro/main.js` in your code editor.
2.  **Update the `BACKEND_URL`**: Find this line at the top of the file:
    ```javascript
    const BACKEND_URL = "https://your-app-name.onrender.com/retouch";
    ```
3.  **Replace the Placeholder**: Replace `https://your-app-name.onrender.com` with the URL you got from Render in the previous step. Make sure to keep the `/retouch` at the end. For example:
    ```javascript
    const BACKEND_URL = "https://ai-skin-retouch-pro.onrender.com/retouch";
    ```
4.  **Save the File**: Save your changes to `main.js`.

---

### Part 3: Packaging the Plugin for Distribution (`.ccx` file)

To sell your plugin, you need to package it into a `.ccx` file. This is the official Adobe installer format that users can simply double-click to install.

#### Step 1: Install the UXP Developer Tool
*   If you don't have it, open the Adobe Creative Cloud desktop app, go to the "Marketplace" tab, search for "UXP Developer Tool", and install it.

#### Step 2: Package the Plugin
1.  **Open the UXP Developer Tool**.
2.  Click **Add Plugin...** and select the `manifest.json` file inside your `ai-skin-retouch-pro` folder.
3.  Your plugin will now appear in the list.
4.  Click the `...` menu on the right side of your plugin entry and select **Package**.
5.  **Choose a Destination**: Select where you want to save the `.ccx` file.
6.  **Packaging Complete**: The tool will create a file named `com.example.aiskinretouchpro_1.0.0.ccx` (the name is based on your manifest).

**This `.ccx` file is your final product!** This is what you will sell to your customers.

---

### Part 4: Selling on Gumroad

[Gumroad](https://gumroad.com/) is a popular platform for selling digital products like Photoshop plugins.

1.  **Create an Account**: Sign up for a free Gumroad account.
2.  **Create a New Product**:
    *   Go to your "Products" page and click "New product".
    *   Choose the "Classic" product type.
    *   Give your product a name (e.g., "AI Skin Retouch Pro for Photoshop").
    *   Set your price.
3.  **Upload Your Files**:
    *   In the product editor, upload the `.ccx` file you created in Part 3.
    *   It's highly recommended to also include a simple `README.txt` or `.pdf` with installation instructions for your customers (e.g., "Double-click the .ccx file to install. The plugin will appear under Plugins > AI Skin Retouch Pro in Photoshop.").
4.  **Customize Your Product Page**:
    *   Write a compelling description.
    *   Upload a cover image or video showing the plugin in action. This is crucial for sales!
5.  **Publish**: Once you're happy with your page, hit "Publish"!

You are now ready to share the link to your Gumroad page and start selling your Photoshop plugin. Good luck!
