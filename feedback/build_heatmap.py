def build_heatmap(parsed_scenes, chapter_average):
    """
    Input:
        parsed_scenes: List of dicts from `parse_scene_scores`
        chapter_average: Dict from `aggregate_element_scores`
    Output:
        Dict with full heatmap structure
    """
    heatmap = {
        "chapter_average": chapter_average,
        "scenes": []
    }

    for scene in parsed_scenes:
        heatmap["scenes"].append({
            "scene_title": scene["scene_title"],
            "element_scores": scene["element_scores"]
        })

    return heatmap


def build_heatmap(scene_outputs, chapter_avg):
    """
    Create a full heatmap comparing each scene's element scores to chapter average.

    Args:
        scene_outputs (list of dicts): Each scene’s parsed scores, including 'scene_title'.
        chapter_avg (dict): Average score per element across chapter.

    Returns:
        dict: {
            "chapter_summary": {element: avg},
            "scene_breakdown": [
                {
                    "scene_title": "...",
                    "scores": {element: value},
                    "relative": {element: difference_from_avg}
                },
                ...
            ]
        }
    """
    heatmap = {
        "chapter_summary": chapter_avg,
        "scene_breakdown": []
    }

    for scene in scene_outputs:
        scene_title = scene["scene_title"]
        scores = {k: v for k, v in scene.items() if k != "scene_title"}

        relative = {
            element: round(scores[element] - chapter_avg[element], 2)
            for element in chapter_avg
        }

        heatmap["scene_breakdown"].append({
            "scene_title": scene_title,
            "scores": scores,
            "relative": relative
        })

    return heatmap

