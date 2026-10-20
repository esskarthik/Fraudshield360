from typing import List, Dict, Tuple
import os


def generate_explanation_and_recommendations(
    analysis: Dict,
) -> Tuple[str, List[Dict]]:
    indicators = analysis.get("warning_indicators", [])
    level = analysis.get("risk_level", "Low")
    score = analysis.get("risk_score", 0)
    category = analysis.get("category", "Suspicious Message")
    urls = analysis.get("urls", [])

    parts: List[str] = []
    parts.append(
        f"This message has been assessed as {level.lower()} risk "
        f"(score {score}/100) and falls under the category: {category}."
    )

    details = []
    for ind in indicators:
        if ind["id"] == "no-indicators":
            continue
        details.append(ind["description"])
    if details:
        parts.append("Key concerns: " + " ".join(details))

    if urls:
        suspicious = [u for u in urls if u["is_suspicious"]]
        if suspicious:
            parts.append(
                "Avoid clicking the links shown. They display suspicious characteristics "
                "such as unusual domains or IP addresses."
            )
        else:
            parts.append(
                "A message link was detected. Only open links from trusted, verified sources."
            )

    if analysis.get("sensitive_information_requested"):
        parts.append(
            "Never share OTPs, passwords, PINs, or banking credentials in response to "
            "an unsolicited message."
        )

    if analysis.get("urgency_detected"):
        parts.append(
            "Do not let urgent language rush you. Take time to verify the claim through "
            "an official, trusted channel."
        )

    explanation = " ".join(parts)

    recommendations: List[Dict] = []
    recommendations.append({
        "id": "do-not-click",
        "text": "Do not click on suspicious links or download attachments from unknown sources.",
    })
    recommendations.append({
        "id": "no-credentials",
        "text": "Never share OTPs, passwords, PINs, or banking credentials.",
    })
    recommendations.append({
        "id": "verify-official",
        "text": "Verify unexpected alerts or payment requests through the organization's official app or website.",
    })
    recommendations.append({
        "id": "report",
        "text": "Report suspected fraud through official cybercrime or consumer protection channels.",
    })

    return explanation, recommendations


def mock_llm_analysis(message: str, analysis: Dict) -> Dict:
    """Fallback rule-based explanation when an LLM API is not configured."""
    explanation, recommendations = generate_explanation_and_recommendations(analysis)
    return {
        "explanation": explanation,
        "recommendations": recommendations,
    }
