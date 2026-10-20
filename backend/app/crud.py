from sqlalchemy.orm import Session
from app import models, schemas


def create_scan_record(db: Session, record: schemas.ScanResponse) -> models.ScanRecord:
    db_record = models.ScanRecord(
        risk_score=record.risk_score,
        risk_level=record.risk_level,
        category=record.category,
        urgency=record.urgency_detected,
        sensitive_requested=record.sensitive_information_requested,
        url_detected=record.url_detected,
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def get_recent_scans(db: Session, limit: int = 10):
    return (
        db.query(models.ScanRecord)
        .order_by(models.ScanRecord.created_at.desc())
        .limit(limit)
        .all()
    )


def get_dashboard_stats(db: Session):
    total = db.query(models.ScanRecord).count()
    high = (
        db.query(models.ScanRecord)
        .filter(models.ScanRecord.risk_score >= 60)
        .count()
    )
    medium = (
        db.query(models.ScanRecord)
        .filter(models.ScanRecord.risk_score >= 30)
        .filter(models.ScanRecord.risk_score < 60)
        .count()
    )
    low = total - high - medium
    recent = get_recent_scans(db)
    return {
        "total_scans": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "recent_scans": recent,
    }
