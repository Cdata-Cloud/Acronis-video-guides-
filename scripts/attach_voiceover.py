#!/usr/bin/env python3
"""Link recorded voiceover files to a guide spec.

Looks for public/guides/<id>/vo/<lang>/step-NN.(mp3|wav|m4a) and sets each step's
`voiceover` to the files that exist (steps without a file get no voiceover for that language).

Usage: python attach_voiceover.py src/guides/<id>.json [--public public]
"""
import json, os, sys

args = sys.argv[1:]
spec_path = args[0]
public = args[args.index("--public") + 1] if "--public" in args else "public"
spec = json.load(open(spec_path, encoding="utf-8"))
gid = spec["id"]
found = {"he": 0, "en": 0}
for i, step in enumerate(spec["steps"], 1):
    vo = {}
    for lang in ("he", "en"):
        for ext in ("mp3", "wav", "m4a"):
            rel = f"guides/{gid}/vo/{lang}/step-{i:02d}.{ext}"
            if os.path.isfile(os.path.join(public, rel)):
                vo[lang] = rel; found[lang] += 1; break
    if vo: step["voiceover"] = vo
    else: step.pop("voiceover", None)
json.dump(spec, open(spec_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
n = len(spec["steps"])
print(f"Hebrew: {found['he']}/{n} steps, English: {found['en']}/{n} steps linked.")
