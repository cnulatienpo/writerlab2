import os
import re
import json
import textwrap
from typing import Dict, List

import requests
try:
    from feedback.extract_element_scores_v2 import extract_element_scores_v2
except Exception:
    extract_element_scores_v2 = None
if extract_element_scores_v2 is None:
    extract_element_scores_v2 = lambda cid, raw, debug=False: extract_element_scores(cid, raw, debug)

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

# Base prompt used to score all elements in one call
BATCH_PROMPT_TEMPLATE = textwrap.dedent("""
You are a writing assistant trained to detect and score story structure.

Read the chapter below. For each of the following elements, return a potency score using this exact scale:
- "none" – not present
- "low" – vaguely present or weak
- "medium" – clearly present and active
- "high" – central to the chapter
- "uncertain" – not sure if it’s there or not

Elements to score:
1. Desire — what the character wants
2. Stakes — what they might lose or gain
3. Conflict — what pushes back
4. Decision — what meaningful choice is made
5. Change — what’s different by the end

Return only a JSON object in this format:
{
  "desire": { "potency": "high" },
  "stakes": { "potency": "medium" },
  "conflict": { "potency": "medium" },
  "decision": { "potency": "none" },
  "change": { "potency": "low" }
}

Now, here is the chapter to score:
{chapter_text}
""")

# Fallback instructions for each element
FALLBACK_INSTRUCTIONS = {
    "desire": "Check if the character expresses a want, need, or goal.",
    "stakes": "Check if the character has anything meaningful to gain or lose.",
    "conflict": "Check if there is anything opposing or resisting the character.",
    "decision": "Check if the character makes a meaningful choice that affects the story.",
    "change": "Check if anything is different by the end of the chapter — emotionally, relationally, or narratively."
}

ALLOWED_POTENCIES = ["none", "low", "medium", "high", "uncertain"]


def _call_deepseek(prompt: str, api_key: str, model: str = DEEPSEEK_MODEL, max_tokens: int = 300) -> str:
    """Send a prompt to the DeepSeek API and return the raw text response."""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a writing assistant that returns structured JSON only."},
            {"role": "user", "content": textwrap.shorten(prompt, width=20000)}
        ],
        "temperature": 0.2,
        "max_tokens": max_tokens
    }
    response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"].strip()


def call_deepseek_batch(chapter_text: str, api_key: str, model: str = DEEPSEEK_MODEL) -> str:
    """Score all elements in one API call."""
    prompt = BATCH_PROMPT_TEMPLATE.format(chapter_text=chapter_text)
    return _call_deepseek(prompt, api_key, model)


def call_deepseek_fallback(element: str, chapter_text: str, api_key: str, model: str = DEEPSEEK_MODEL) -> str:
    """Request a single element using a fallback prompt."""
    instruction = FALLBACK_INSTRUCTIONS[element]
    prompt = textwrap.dedent(f"""
    Read the chapter below and score this story element: {element.upper()}.

    {instruction}

    Respond ONLY with valid JSON in this format:
    {{
      "{element}": {{
        "potency": "none" | "low" | "medium" | "high" | "uncertain"
      }}
    }}

    Chapter:
    {chapter_text}
    """)
    return _call_deepseek(prompt, api_key, model)


def extract_element_scores(chapter_id: str, raw_response: str, debug: bool = False) -> Dict:
    """Parse DeepSeek's text response and identify missing or uncertain elements."""
    elements = ["desire", "stakes", "conflict", "decision", "change"]
    element_scores: Dict[str, Dict[str, str]] = {}
    missing: List[str] = []
    confidence_log: List[str] = []

    for element in elements:
        present = False
        potency = "none"
        confidence = "low"
        pattern = rf"{element}\s*[:\-–]?\s*(?P<score>none|low|medium|high|uncertain)"
        match = re.search(pattern, raw_response, re.IGNORECASE)
        if match:
            potency = match.group("score").lower()
            present = potency not in ("none", "uncertain")
            confidence = "high" if potency in ALLOWED_POTENCIES else "low"
            if potency in ("none", "uncertain"):
                missing.append(element)
        else:
            missing.append(element)
            confidence = "none"

        element_scores[element] = {
            "present": present,
            "potency": potency,
            "confidence": confidence,
        }
        confidence_log.append(f"{element}: {potency.upper()} (confidence: {confidence})")

    if debug:
        print("\n📋 Confidence Log:")
        for line in confidence_log:
            print(" -", line)
        if missing:
            print("\n🚩 Missing or ambiguous elements:")
            for m in missing:
                print(" -", m)

    return {
        "chapter_id": chapter_id,
        "element_scores": element_scores,
        "missing_elements": missing,
        "confidence_log": confidence_log,
    }


def merge_element_scores(original_scores: Dict, fallback_results: Dict) -> Dict:
    """Merge fallback scores into the original structure."""
    for element, new_data in fallback_results.items():
        if element in original_scores["element_scores"]:
            original_potency = original_scores["element_scores"][element]["potency"]
            if original_potency in ["none", "uncertain"]:
                original_scores["element_scores"][element] = {
                    "present": new_data.get("potency") not in ("none", "uncertain"),
                    "potency": new_data.get("potency", "uncertain"),
                    "confidence": "fallback",
                }
    return original_scores


def score_chapter(chapter_id: str, chapter_text: str, api_key: str, model: str = DEEPSEEK_MODEL, debug: bool = False) -> Dict:
    """High level helper that scores a chapter and retries missing elements."""
    batch_raw = call_deepseek_batch(chapter_text, api_key, model)
    scores = extract_element_scores(chapter_id, batch_raw, debug)

    if scores["missing_elements"]:
        fallback_results = {}
        for element in scores["missing_elements"]:
            fb_raw = call_deepseek_fallback(element, chapter_text, api_key, model)
            try:
                fb_json = json.loads(fb_raw)
            except json.JSONDecodeError:
                fb_json = {}
            fallback_results[element] = fb_json.get(element, {"potency": "uncertain"})
        scores = merge_element_scores(scores, fallback_results)
    return scores
# New helper functions for scene-based scoring

SCENE_DIVIDER_PATTERN = re.compile(r"\n\s*(?:###|---)\s*\n")

POTENCY_TO_NUM = {"none": 0, "low": 1, "medium": 2, "high": 3, "uncertain": 0}
NUM_TO_POTENCY = {0: "none", 1: "low", 2: "medium", 3: "high"}

def split_into_scenes(chapter_text: str) -> List[str]:
    """Split a chapter string into scenes using simple heuristics."""
    if SCENE_DIVIDER_PATTERN.search(chapter_text):
        parts = SCENE_DIVIDER_PATTERN.split(chapter_text)
    else:
        parts = re.split(r"\n{2,}", chapter_text)
    scenes = [p.strip() for p in parts if p.strip()]
    return scenes


def _aggregate_scene_scores(scene_scores: List[Dict]) -> Dict[str, Dict[str, str]]:
    """Average potency across scenes for each story element."""
    elements = ["desire", "stakes", "conflict", "decision", "change"]
    aggregated: Dict[str, Dict[str, str]] = {}
    for element in elements:
        numeric = [POTENCY_TO_NUM.get(s["element_scores"][element]["potency"], 0) for s in scene_scores]
        avg = sum(numeric) / len(numeric) if numeric else 0
        avg_potency = NUM_TO_POTENCY.get(int(round(avg)), "none")
        aggregated[element] = {
            "present": avg > 0,
            "potency": avg_potency,
        }
    return aggregated


def score_chapter_scenes(chapter_id: str, chapter_text: str, api_key: str, model: str = DEEPSEEK_MODEL, debug: bool = False) -> Dict:
    """Split a chapter into scenes and score each one individually."""
    scenes = split_into_scenes(chapter_text)
    if len(scenes) <= 1:
        print("⚠️ Scene split failed; scoring full chapter as one scene")
        scenes = [chapter_text]
    scene_results = []
    for idx, scene in enumerate(scenes, 1):
        print(f"Scoring scene {idx}/{len(scenes)}...")
        raw = call_deepseek_batch(scene, api_key, model)
        scene_score = extract_element_scores_v2(f"{chapter_id}_scene_{idx}", raw, debug)
        scene_results.append(scene_score)
    aggregated = _aggregate_scene_scores(scene_results)
    return {
        "chapter_id": chapter_id,
        "scene_breakdowns": scene_results,
        "element_scores": aggregated,
    }
