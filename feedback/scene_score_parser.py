def parse_scene_scores(raw_response, scene_title="Untitled Scene"):
    """
    Input: raw_response = dict output from DeepSeek or similar model
    Output: dict with scene_title and parsed element_scores
    """
    core_elements = ["desire", "stakes", "conflict", "decision", "change"]
    parsed = {
        "scene_title": scene_title,
        "element_scores": {}
    }

    for element in core_elements:
        score = raw_response.get("elements", {}).get(element, {}).get("potency")
        if isinstance(score, (int, float)):
            parsed["element_scores"][element] = score
        else:
            parsed["element_scores"][element] = 0  # default/fallback

    return parsed
