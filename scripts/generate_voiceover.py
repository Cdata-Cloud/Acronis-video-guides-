#!/usr/bin/env python3
"""Generate draft voiceover files from each step's narration text using edge-tts.

Writes public/guides/<id>/vo/<lang>/step-NN.mp3 for every step (both languages by default).
Then run attach_voiceover.py to link them to the spec.

Requires: pip install edge-tts   (needs internet; works in GitHub Codespaces)

Usage:
  python3 generate_voiceover.py src/guides/<id>.json [--public public] [--lang he|en]
         [--voice-he he-IL-HilaNeural] [--voice-en en-US-JennyNeural] [--rate +0%]
         [--steps 3,5]   (only regenerate these steps)
Hebrew voices: he-IL-HilaNeural (female), he-IL-AvriNeural (male).
"""
import asyncio, json, os, sys

try:
    import edge_tts
except ImportError:
    sys.exit("edge-tts is not installed. Run:  pip install edge-tts")


def opt(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default


async def main():
    spec_path = sys.argv[1]
    public = opt("--public", "public")
    langs = [opt("--lang")] if opt("--lang") else ["he", "en"]
    voices = {"he": opt("--voice-he", "he-IL-HilaNeural"), "en": opt("--voice-en", "en-US-JennyNeural")}
    rate = opt("--rate", "+0%")
    only = {int(x) for x in opt("--steps", "").split(",") if x.strip()}
    spec = json.load(open(spec_path, encoding="utf-8"))
    gid = spec["id"]
    for lang in langs:
        folder = os.path.join(public, "guides", gid, "vo", lang)
        os.makedirs(folder, exist_ok=True)
        for i, step in enumerate(spec["steps"], 1):
            if only and i not in only:
                continue
            text = (step.get("narration") or step["caption"])[lang]
            out = os.path.join(folder, f"step-{i:02d}.mp3")
            await edge_tts.Communicate(text, voices[lang], rate=rate).save(out)
            print(f"{lang} step {i:02d} -> {out}")
    print("Done. Now run: python3 scripts/attach_voiceover.py " + spec_path)


asyncio.run(main())
