# ================================================================
# AI Skin Retouch Pro - Backend API (FastAPI)
# ------------------------------------------------
# This simple backend receives an image from Photoshop,
# performs a basic "skin retouch" placeholder effect (using Pillow),
# and returns the processed image.
# You can later replace the placeholder section with an AI model
# (e.g., GFPGAN, CodeFormer, or a custom diffusion model).
# ================================================================

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from PIL import Image, ImageFilter
import io

app = FastAPI(title="AI Skin Retouch Pro API")

@app.get("/")
def read_root():
    return {"message": "AI Skin Retouch Pro Backend is running."}


@app.post("/retouch")
async def retouch_image(file: UploadFile = File(...)):
    """
    Receives an uploaded portrait image, applies basic skin-smoothing filter,
    and returns the result as a JPEG binary stream.
    """

    try:
        # Read the uploaded image into memory
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # ----------------------------------------------------------
        # Placeholder AI Retouch Effect (replace with real AI model)
        # ----------------------------------------------------------
        # Apply mild smoothing and blur for demonstration
        processed_image = image.filter(ImageFilter.SMOOTH_MORE)
        processed_image = processed_image.filter(ImageFilter.MedianFilter(size=3))

        # Optional: enhance brightness or contrast here if desired
        # Example (using Pillow's ImageEnhance):
        # from PIL import ImageEnhance
        # enhancer = ImageEnhance.Brightness(processed_image)
        # processed_image = enhancer.enhance(1.05)

        # Save processed image to bytes buffer
        buf = io.BytesIO()
        processed_image.save(buf, format="JPEG", quality=95)
        buf.seek(0)

        # Return processed image as binary JPEG
        return Response(content=buf.getvalue(), media_type="image/jpeg")

    except Exception as e:
        print("Error during image processing:", e)
        return {"error": str(e)}
