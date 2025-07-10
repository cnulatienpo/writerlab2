def aggregate_element_scores(scene_outputs):
    """
    Computes average potency for each element across all scenes.

    Args:
        scene_outputs (list of dicts): Each dict should contain potency scores like 'desire', 'stakes', etc.

    Returns:
        dict: Element-wise average scores.
    """
    from collections import defaultdict

    totals = defaultdict(float)
    counts = defaultdict(int)

    for scene in scene_outputs:
        for element, value in scene.items():
            if element in ["desire", "stakes", "conflict", "decision", "change"]:
                totals[element] += value
                counts[element] += 1

    averages = {}
    for element in totals:
        avg = totals[element] / counts[element] if counts[element] > 0 else 0
        averages[element] = round(avg, 2)

    return averages
