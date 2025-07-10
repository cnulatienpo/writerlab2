def parse_scene_scores(scene_outputs):
    """
    Input: List of tuples: (scene_title, raw_json_output_string_from_machine)
    Output: List of dicts with standardized structure:
        {
            "scene_title": str,
            "element_scores": {
                "desire": int,
                "stakes": int,
                "conflict": int,
                "decision": int,
                "change": int
            }
        }
    """
    import json

    parsed = []
    for title, raw_output in scene_outputs:
        try:
            data = json.loads(raw_output)
            scene_data = {
                "scene_title": title,
                "element_scores": {
                    key: int(data.get(key, 0))
                    for key in ["desire", "stakes", "conflict", "decision", "change"]
                }
            }
            parsed.append(scene_data)
        except Exception as e:
            print(f"Failed to parse scene '{title}': {e}")
            continue

    return parsed
