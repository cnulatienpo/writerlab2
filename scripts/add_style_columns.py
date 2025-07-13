import pandas as pd

# Customize for all your elements and load levels!
load_styles = {
    "low":    {"color": "#f87171", "symbol": "🟥", "code": "LOW"},
    "medium": {"color": "#facc15", "symbol": "🟨", "code": "MED"},
    "high":   {"color": "#4ade80", "symbol": "🟩", "code": "HIGH"},
    "error":  {"color": "#a3a3a3", "symbol": "⬜",  "code": "ERR"},
}

ELEMENTS = ["desire", "conflict", "climax"]  # Add all your elements here!
INPUT_CSV = "labeled_desire.csv"
OUTPUT_CSV = "labeled_desire_visual.csv"

df = pd.read_csv(INPUT_CSV)

def style_cell(val):
    val = str(val).strip().lower()
    return load_styles.get(val, load_styles["error"])

# Only process the element that matches the 'element' column value in the CSV
for elem in ELEMENTS:
    if 'element' in df.columns and df['element'].iloc[0] == elem:
        df[f"{elem}_color"] = df['load_level'].apply(lambda x: style_cell(x)["color"])
        df[f"{elem}_symbol"] = df['load_level'].apply(lambda x: style_cell(x)["symbol"])
        df[f"{elem}_code"] = df['load_level'].apply(lambda x: style_cell(x)["code"])

df.to_csv(OUTPUT_CSV, index=False)
print(f"Multi-label, visual-annotated CSV saved as {OUTPUT_CSV}")
