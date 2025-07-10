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
