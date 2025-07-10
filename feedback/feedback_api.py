from flask import Flask, request, jsonify
from feedback.chapter_feedback import score_chapter_scenes

app = Flask(__name__)

@app.route('/api/score_chapter_scenes', methods=['POST'])
def score_chapter_scenes_endpoint():
    data = request.json
    chapter_text = data.get('chapter', '')
    chapter_id = data.get('chapter_id', 'chapter_001')
    api_key = data.get('api_key', '')

    if not chapter_text.strip():
        return jsonify({'error': 'No chapter text submitted.'}), 400

    result = score_chapter_scenes(chapter_id, chapter_text, api_key)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
