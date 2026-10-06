#!/usr/bin/env python3
"""Print a Markdown recording script for a guide's voiceover, both languages.

Usage: python export_narration.py src/guides/<id>.json > narration-<id>.md
"""
import json, sys

spec = json.load(open(sys.argv[1], encoding="utf-8"))
gid = spec["id"]
names = {"he": "עברית", "en": "English"}
out = [f"# Voiceover script: {spec['title']['en']} / {spec['title']['he']}", ""]
out.append("Record one file per step. Leave ~0.5s of silence at the start and end; "
           "export as MP3 or WAV to the path shown.\n")
for lang in ("he", "en"):
    out.append(f"## {names[lang]}\n")
    for i, s in enumerate(spec["steps"], 1):
        text = (s.get("narration") or s["caption"])[lang]
        path = (s.get("voiceover") or {}).get(lang) or f"guides/{gid}/vo/{lang}/step-{i:02d}.mp3"
        out.append(f"**Step {i}**  →  `public/{path}`\n")
        out.append(f"> {text}\n")
print("\n".join(out))
