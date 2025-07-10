import json

POTENCY_TO_NUM = {
    "none": 0,
    "low": 1,
    "medium": 2,
    "high": 3,
    "uncertain": 0,
}


def extract_element_scores(raw_response: str) -> dict:
    """Convert the model JSON response into a dict of numeric scores."""
    try:
        data = json.loads(raw_response)
    except json.JSONDecodeError:
        cleaned = raw_response.split("```json")[-1].split("```")[0].strip()
        data = json.loads(cleaned)

    scores = {}
    for element, info in data.items():
        potency = str(info.get("potency", "none")).lower()
        scores[element] = POTENCY_TO_NUM.get(potency, 0)
    return scores
