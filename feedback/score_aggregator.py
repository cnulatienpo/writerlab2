def aggregate_element_scores(scene_scores):
    """
    Input: List of scene score dicts, each with a 'scene_title' and 'element_scores'
    Output: Dict of average scores for each element across the chapter
    """
    core_elements = ["desire", "stakes", "conflict", "decision", "change"]
    total_scores = {element: 0 for element in core_elements}
    counts = {element: 0 for element in core_elements}

    for scene in scene_scores:
        for element in core_elements:
            score = scene["element_scores"].get(element)
            if score is not None:
                total_scores[element] += score
                counts[element] += 1

    averaged_scores = {}
    for element in core_elements:
        if counts[element] > 0:
            averaged_scores[element] = round(total_scores[element] / counts[element], 2)
        else:
            averaged_scores[element] = 0

    return averaged_scores
