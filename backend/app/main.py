from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import database, models, schemas, crud, analyzer, ai_service, ocr_service
import os

from pydantic import BaseModel, Field

database.init_db()

app = FastAPI(
    title="FraudShield 360 API",
    description="AI-powered scam and phishing message detection platform.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin for origin in [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            os.getenv("FRONTEND_URL"),
        ] if origin
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health", response_model=schemas.HealthResponse, tags=["system"])
@app.get("/api/health", response_model=schemas.HealthResponse, include_in_schema=False)
def health():
    return {"status": "ok", "service": "fraudshield360"}


@app.post("/scan", response_model=schemas.ScanResponse, tags=["scan"])
@app.post("/api/scan", response_model=schemas.ScanResponse, include_in_schema=False)
def scan_message(
    request: schemas.ScanRequest,
    db: Session = Depends(database.get_db),
):
    text = request.message.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    analysis = analyzer.analyze_text(text)
    ai_result = ai_service.mock_llm_analysis(text, analysis)

    response = schemas.ScanResponse(
        risk_score=analysis["risk_score"],
        risk_level=analysis["risk_level"],
        category=analysis["category"],
        urgency_detected=analysis["urgency_detected"],
        sensitive_information_requested=analysis["sensitive_information_requested"],
        url_detected=analysis["url_detected"],
        urls=analysis["urls"],
        warning_indicators=analysis["warning_indicators"],
        explanation=ai_result["explanation"],
        recommendations=ai_result["recommendations"],
    )

    crud.create_scan_record(db, response)
    return response


def _build_scan_response(text: str, db: Session) -> schemas.ScanResponse:
    analysis = analyzer.analyze_text(text)
    ai_result = ai_service.mock_llm_analysis(text, analysis)
    response = schemas.ScanResponse(
        **analysis,
        explanation=ai_result["explanation"],
        recommendations=ai_result["recommendations"],
    )
    crud.create_scan_record(db, response)
    return response


@app.post("/scan/image", response_model=schemas.ImageScanResponse, tags=["scan"])
@app.post("/api/scan/image", response_model=schemas.ImageScanResponse, include_in_schema=False)
async def scan_image(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
):
    extracted_text = await ocr_service.extract_text_from_image(file)
    response = _build_scan_response(extracted_text, db)
    return {"extracted_text": extracted_text, "analysis": response}


@app.get("/dashboard", response_model=schemas.DashboardStats, tags=["dashboard"])
@app.get("/api/dashboard", response_model=schemas.DashboardStats, include_in_schema=False)
def dashboard(db: Session = Depends(database.get_db)):
    return crud.get_dashboard_stats(db)

@app.get("/")
def home():
    return {
        "project": "FraudShield 360",
        "status": "Running",
        "message": "Welcome to FraudShield 360 API!"
    }

class MessageRequest(BaseModel):
    message: str = Field(
        min_length=3,
        max_length=10000,
        description="Suspicious message to analyze"
    )
@app.post("/api/analyze")
def analyze(request: MessageRequest, db: Session = Depends(database.get_db)):
    message = request.message.strip()
    analysis = analyzer.analyze_text(message)
    ai_result = ai_service.mock_llm_analysis(message, analysis)
    response = schemas.ScanResponse(
        **analysis,
        explanation=ai_result["explanation"],
        recommendations=ai_result["recommendations"],
    )
    crud.create_scan_record(db, response)
    return response
