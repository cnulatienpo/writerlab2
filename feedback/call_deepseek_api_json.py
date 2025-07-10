import os
import openai
import textwrap

openai.api_key = os.getenv("DEEPSEEK_API_KEY", "")
DEFAULT_MODEL = os.getenv("DEEPSEEK_MODEL", "gpt-3.5-turbo")


def call_deepseek_api_json(chapter_text: str, elements: list, model: str = DEFAULT_MODEL, max_tokens: int = 300) -> str:
    """Send chapter text to the DeepSeek (OpenAI compatible) API and return raw JSON."""
    element_lines = "\n".join(f"{idx + 1}. {el.capitalize()}" for idx, el in enumerate(elements))
    json_lines = ",\n".join([f'  "{el}": {{ "potency": "high" }}' for el in elements])
    prompt = textwrap.dedent(f"""
    You are a writing assistant trained to detect and score story structure.

    Read the chapter below. For each of the following elements, return a potency score using this exact scale:
    - "none" – not present
    - "low" – vaguely present or weak
    - "medium" – clearly present and active
    - "high" – central to the chapter
    - "uncertain" – not sure if it’s there or not

    Elements to score:
    {element_lines}

    Return only a JSON object in this format:
    {{
    {json_lines}
    }}

    Now, here is the chapter to score:
    {chapter_text}
    """)

    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a writing assistant that returns structured JSON only."},
            {"role": "user", "content": textwrap.shorten(prompt, width=20000)}
        ],
        temperature=0.2,
        max_tokens=max_tokens,
    )

    return response.choices[0].message["content"].strip()
