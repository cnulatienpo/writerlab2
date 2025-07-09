import os
import time
import pandas as pd
from tqdm import tqdm
import openai

# === CONFIGURATION ===
INPUT_CSV = "deepseek_dataset.csv"  # Your dataset
OUTPUT_CSV = "labeled_character_elements.csv"

# API setup
openai.api_key = "sk-0c5deb25d184480db47c2b9ad42eaac3"  # replace with your real key or env var
openai.api_base = "https://api.deepseek.com/v1"
MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

# Load data
df = pd.read_csv(INPUT_CSV)

CHARACTER_TOPICS = [
    "motivation",
    "drive",
    "flaw",
    "decision making style",
    "identity",
    "back story"
]

# Helper to build prompt for each topic
def build_prompt(topic, text):
    return (
        f"You are an expert literary analyst. \n\n"
        f"Rate the presence and strength of the character aspect '{topic}' in the following text snippet. \n"
        f"Character aspects mean:\n"
        "- motivation: what a character wants or aims for.\n"
        "- drive: the emotional or psychological fuel pushing them.\n"
        "- flaw: weaknesses, contradictions, or internal struggles.\n"
        "- decision making style: how they make choices (impulsive, cautious, etc).\n"
        "- identity: who the character believes they are or how they see themselves.\n"
        "- back story: relevant past events or history shaping them.\n\n"
        "Respond with exactly one word: low, medium, or high.\n\n"
        f"Text:\n{text}"
    )

print(f"Labeling character elements for {len(df)} texts...")

for topic in CHARACTER_TOPICS:
    print(f"\nLabeling topic: {topic}")
    labels = []
    for text in tqdm(df["text"], desc=f"Labeling {topic}"):
        prompt = build_prompt(topic, text)
        try:
            response = openai.ChatCompletion.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert literary analyst."},
                    {"role": "user", "content": prompt}
                ]
            )
            label = response.choices[0].message.content.strip().lower()
            if label not in {"low", "medium", "high"}:
                label = "low"
        except Exception as e:
            print(f"Error labeling '{topic}': {e}")
            label = "low"
        labels.append(label)
        time.sleep(1)  # Adjust for rate limits
    df[topic.replace(" ", "_")] = labels

df.to_csv(OUTPUT_CSV, index=False)
print(f"\nDone! Character element labels saved to {OUTPUT_CSV}")
