import re
from urllib.parse import urlparse
from typing import List, Dict, Tuple


URGENT_KEYWORDS = [
    "immediately", "urgent", "act now", "within 24 hours", "suspended",
    "blocked", "deactivated", "expire", "expires", "final notice",
    "limited time", "hurry", "asap", "action required", "verify now",
]

SENSITIVE_KEYWORDS = [
    "otp", "password", "pin", "pin number", "ssn", "social security",
    "cvv", "credit card", "debit card", "bank account", "login",
    "credentials", "username", "verify your identity", "confirm",
]

MONEY_KEYWORDS = [
    "transfer", "wire", "send money", "payment", "refund", "prize",
    "lottery", "won", "reward", "cash", "gift card", "bitcoin",
    "crypto", "invoice", "overdue", "unpaid",
]

IMPERSONATION_KEYWORDS = [
    "bank of", "paypal", "amazon", "microsoft", "apple support",
    "irs", "government", "official", "department", "security team",
]

SUSPICIOUS_TLDS = {".xyz", ".top", ".click", ".buzz", ".work", ".loan", ".date"}

URL_RE = re.compile(r"https?://[^\s<>\"]+", re.IGNORECASE)


def extract_urls(text: str) -> List[Dict]:
    urls = []
    for match in URL_RE.findall(text):
        try:
            parsed = urlparse(match)
            domain = parsed.netloc.lower()
        except Exception:
            domain = ""
        reasons: List[str] = []
        is_suspicious = False

        if not domain:
            is_suspicious = True
            reasons.append("unparseable domain")

        if any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
            is_suspicious = True
            reasons.append("suspicious top-level domain")

        if re.search(r"\d{1,3}(\.\d{1,3}){3}", domain):
            is_suspicious = True
            reasons.append("IP address used as domain")

        if "@" in match:
            is_suspicious = True
            reasons.append("contains @ symbol")

        if len(domain) > 40:
            is_suspicious = True
            reasons.append("unusually long domain")

        urls.append({
            "url": match,
            "domain": domain,
            "is_suspicious": is_suspicious,
            "reasons": reasons,
        })
    return urls


def _count_keywords(text_lower: str, keywords: List[str]) -> int:
    return sum(1 for kw in keywords if kw in text_lower)


def analyze_text(text: str) -> Dict:
    text_lower = text.lower()

    urgency = any(kw in text_lower for kw in URGENT_KEYWORDS)
    sensitive_requested = any(kw in text_lower for kw in SENSITIVE_KEYWORDS)
    money_request = _count_keywords(text_lower, MONEY_KEYWORDS) > 0
    impersonation = _count_keywords(text_lower, IMPERSONATION_KEYWORDS) > 0

    urls = extract_urls(text)
    url_detected = len(urls) > 0
    suspicious_urls = [u for u in urls if u["is_suspicious"]]

    indicators: List[Dict] = []

    if urgency:
        indicators.append({
            "id": "urgency",
            "title": "Urgency or threats detected",
            "description": "The message uses urgent or threatening language to pressure you into acting quickly.",
            "severity": "high",
        })
    if sensitive_requested:
        indicators.append({
            "id": "sensitive-info",
            "title": "Sensitive information requested",
            "description": "The message asks for OTPs, passwords, PINs, or other credentials. Legitimate organizations will not ask for these over SMS or email.",
            "severity": "high",
        })
    if money_request:
        indicators.append({
            "id": "money-request",
            "title": "Money or reward request",
            "description": "The message mentions payments, transfers, prizes, or lotteries, which are common scam tactics.",
            "severity": "high",
        })
    if impersonation:
        indicators.append({
            "id": "impersonation",
            "title": "Possible impersonation",
            "description": "The message claims to be from a known organization. Verify through official channels before responding.",
            "severity": "medium",
        })
    if suspicious_urls:
        indicators.append({
            "id": "suspicious-url",
            "title": "Suspicious link detected",
            "description": "One or more links show risky characteristics such as unusual domains or IP addresses.",
            "severity": "high",
        })
    elif url_detected:
        indicators.append({
            "id": "url-detected",
            "title": "Link detected",
            "description": "The message contains a link. Do not click it unless you are certain it is legitimate.",
            "severity": "medium",
        })

    if not indicators:
        indicators.append({
            "id": "no-indicators",
            "title": "No strong warning signs",
            "description": "No high-risk patterns were detected, but always remain cautious with unsolicited messages.",
            "severity": "low",
        })

    score = _compute_score(
        urgency=urgency,
        sensitive_requested=sensitive_requested,
        money_request=money_request,
        impersonation=impersonation,
        url_detected=url_detected,
        suspicious_url_count=len(suspicious_urls),
    )

    level = _level_from_score(score)
    category = _categorize(text_lower)

    return {
        "risk_score": score,
        "risk_level": level,
        "category": category,
        "urgency_detected": urgency,
        "sensitive_information_requested": sensitive_requested,
        "url_detected": url_detected,
        "urls": urls,
        "warning_indicators": indicators,
    }


def _compute_score(*, urgency, sensitive_requested, money_request,
                   impersonation, url_detected, suspicious_url_count) -> int:
    score = 0
    if urgency:
        score += 25
    if sensitive_requested:
        score += 30
    if money_request:
        score += 20
    if impersonation:
        score += 15
    if url_detected:
        score += 10
    score += min(suspicious_url_count * 10, 30)
    return min(score, 100)


def _level_from_score(score: int) -> str:
    if score >= 60:
        return "High"
    if score >= 30:
        return "Medium"
    return "Low"


def _categorize(text_lower: str) -> str:
    if any(k in text_lower for k in ["bank", "account", "otp", "pin", "credential"]):
        return "Banking Phishing"
    if any(k in text_lower for k in ["lottery", "prize", "won", "reward", "gift card"]):
        return "Prize / Lottery Scam"
    if any(k in text_lower for k in ["job", "employment", "work from home", "internship"]):
        return "Job Scam"
    if any(k in text_lower for k in ["delivery", "package", "shipping", "customs"]):
        return "Delivery Scam"
    if any(k in text_lower for k in ["crypto", "bitcoin", "investment", "forex"]):
        return "Investment Scam"
    return "Suspicious Message"
