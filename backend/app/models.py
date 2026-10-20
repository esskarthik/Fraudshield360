from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
from app.database import Base


class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(Integer, primary_key=True, index=True)
    message_hash = Column(String(64), index=True, nullable=True)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String(20), nullable=False)
    category = Column(String(100), nullable=True)
    urgency = Column(Boolean, default=False)
    sensitive_requested = Column(Boolean, default=False)
    url_detected = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
