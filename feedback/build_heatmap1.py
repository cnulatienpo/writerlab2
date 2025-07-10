def build_heatmap(scene_outputs):
    """
    Creates a full heatmap summary with chapter averages and scene-level deltas.

    Args:
        scene_outputs (list of dicts): Each dict must include a 'scene_title' and potency scores.

    Returns:
        dict: Heatmap with 'chapter_summary' and 'scene_breakdown'.
    """
    from score_aggregator import aggregate_element_scores

    # Compute chapter averages
    chapter_summary = aggregate_element_scores(scene_outputs)

    # Build scene breakdown
    scene_breakdown = []
    for scene in scene_outputs:
        title = scene.get("scene_title", "Untitled Scene")
        relative_scores = {}
        for element, avg in chapter_summary.items():
            if element in scene:
                relative_scores[element] = round(scene[element] - avg, 2)
        scene_breakdown.append({
            "scene_title": title,
            "relative": relative_scores
        })

    return {
        "chapter_summary": chapter_summary,
        "scene_breakdown": scene_breakdown
    }
