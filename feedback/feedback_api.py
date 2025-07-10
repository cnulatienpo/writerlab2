from flask import Flask, request, jsonify
from feedback.extract_element_scores_v2 import parse_batch_element_scores
from feedback.call_deepseek_api_json import call_deepseek_api_json_batch

app = Flask(__name__)

@app.route("/api/score_chapter", methods=["POST"])
def score_chapter():
    data = request.json
    chapter_text = data.get("chapter", "")
    chapter_id = data.get("chapter_id", "chapter_001")

    if not chapter_text.strip():
        return jsonify({"error": "No chapter text submitted."}), 400

    # Call DeepSeek batch scoring
    raw_result = call_deepseek_api_json_batch(chapter_text)
    final_result = parse_batch_element_scores(chapter_id, raw_result)

    return jsonify(final_result)

if __name__ == "__main__":
    app.run(debug=True)
