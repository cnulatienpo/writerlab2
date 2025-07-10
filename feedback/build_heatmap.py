from typing import List, Dict


def build_heatmap(scene_scores: List[Dict[str, int]]) -> Dict:
    """Create heatmap structure from scene scores."""
    if not scene_scores:
        return {"scene_scores": [], "chapter_averages": {}}

    elements = set()
    for scene in scene_scores:
        elements.update(scene.keys())

    chapter_averages = {}
    for el in elements:
        total = sum(scene.get(el, 0) for scene in scene_scores)
        chapter_averages[el] = round(total / len(scene_scores), 2)

    return {
        "scene_scores": scene_scores,
        "chapter_averages": chapter_averages,
    }
