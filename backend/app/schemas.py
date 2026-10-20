from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class ScanRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)


class URLInfo(BaseModel):
    url: str
    domain: str
    is_suspicious: bool
    reasons: List[str]


class WarningIndicator(BaseModel):
    id: str
    title: str
    description: str
    severity: str


class Recommendation(BaseModel):
    id: str
    text: str


class ScanResponse(BaseModel):
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: str
    category: Optional[str] = None
    urgency_detected: bool
    sensitive_information_requested: bool
    url_detected: bool
    urls: List[URLInfo]
    warning_indicators: List[WarningIndicator]
    explanation: str
    recommendations: List[Recommendation]


class ImageScanResponse(BaseModel):
    extracted_text: str
    analysis: ScanResponse


class ScanRecordOut(BaseModel):
    id: int
    risk_score: int
    risk_level: str
    category: Optional[str]
    urgency: bool
    sensitive_requested: bool
    url_detected: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class DashboardStats(BaseModel):
    total_scans: int
    high_risk: int
    medium_risk: int
    low_risk: int
    recent_scans: List[ScanRecordOut]


class HealthResponse(BaseModel):
    status: str
    service: str
