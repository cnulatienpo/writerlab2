def generate_chapter_heatmap(scene_score_list):
    """
    Input: List of parsed scene score dicts (from `parse_scene_scores`)
    Output: Full heatmap JSON including per-scene and chapter-wide average scores
    """
    from score_aggregator import aggregate_element_scores

    heatmap = {
        "scenes": [],
        "chapter_average": {}
    }

    # Add each scene’s element scores
    for scene in scene_score_list:
        heatmap["scenes"].append({
            "scene_title": scene["scene_title"],
            "element_scores": scene["element_scores"]
        })

    # Compute chapter-wide averages
    heatmap["chapter_average"] = aggregate_element_scores(scene_score_list)

    return heatmap
