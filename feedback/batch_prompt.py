import re

SCENE_DIVIDER_PATTERN = re.compile(r"\n\s*(?:###|---)\s*\n")

def split_chapter_into_scenes(chapter_text: str):
    """Split a chapter string into scenes using simple heuristics."""
    if SCENE_DIVIDER_PATTERN.search(chapter_text):
        parts = SCENE_DIVIDER_PATTERN.split(chapter_text)
    else:
        parts = re.split(r"\n{2,}", chapter_text)
    return [p.strip() for p in parts if p.strip()]
