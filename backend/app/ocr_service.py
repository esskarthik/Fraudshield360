from io import BytesIO
import re

from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
import numpy as np
from rapidocr_onnxruntime import RapidOCR


MAX_IMAGE_BYTES = 8 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}
_ocr_engine = RapidOCR()


async def extract_text_from_image(upload: UploadFile) -> str:
    if upload.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Unsupported image type. Upload a PNG, JPEG, WEBP, or BMP screenshot.",
        )

    contents = await upload.read(MAX_IMAGE_BYTES + 1)
    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Screenshot must be 8 MB or smaller.")

    try:
        image = Image.open(BytesIO(contents))
        image.verify()
        image = Image.open(BytesIO(contents))
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.") from exc

    try:
        result, _ = _ocr_engine(np.array(image))
        text = " ".join(item[1] for item in result) if result else ""
        text = _normalize_ocr_text(text.strip())
    except (RuntimeError, ValueError) as exc:
        raise HTTPException(status_code=422, detail="The screenshot could not be processed.") from exc

    if not text:
        raise HTTPException(
            status_code=422,
            detail="No readable text was found in the screenshot.",
        )
    return text[:10000]


def _normalize_ocr_text(text: str) -> str:
    text = re.sub(r"https?\s*//", "https://", text, flags=re.IGNORECASE)
    for _ in range(2):
        text = re.sub(
            r"(https://[A-Za-z0-9.-]+)\s+([A-Za-z0-9.-]+\.[A-Za-z]{2,})",
            r"\1\2",
            text,
            flags=re.IGNORECASE,
        )
    return text
