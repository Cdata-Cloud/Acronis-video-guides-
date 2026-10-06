#!/usr/bin/env python3
"""Validate a guide spec before rendering.

Usage: python validate_guide.py src/guides/<id>.json [--public public]
Exit code 1 if there are errors. Warnings don't fail.
"""
import json, os, re, sys

LANGS = ("he", "en")
MAX_CAPTION_WORDS = 14


def per_lang(value):
    """Return {lang: value} whether the field is bilingual or shared."""
    if isinstance(value, dict) and set(value.keys()) & set(LANGS):
        return {l: value.get(l) for l in LANGS}
    return {l: value for l in LANGS}


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__); sys.exit(2)
    spec_path = args[0]
    public = args[args.index("--public") + 1] if "--public" in args else "public"
    errors, warnings = [], []

    with open(spec_path, encoding="utf-8") as f:
        spec = json.load(f)

    gid = spec.get("id", "")
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", gid or ""):
        errors.append(f"id '{gid}' must be lowercase letters/digits/hyphens")
    expected_name = os.path.splitext(os.path.basename(spec_path))[0]
    if gid and gid != expected_name:
        warnings.append(f"id '{gid}' differs from file name '{expected_name}'")

    def check_bi(obj, field, where, required=True):
        val = obj.get(field)
        if val is None:
            if required: errors.append(f"{where}: missing '{field}'")
            return
        if not isinstance(val, dict):
            errors.append(f"{where}: '{field}' must be {{he, en}}"); return
        for l in LANGS:
            if not str(val.get(l, "")).strip():
                errors.append(f"{where}: '{field}.{l}' is empty")

    def check_file(rel, where):
        if not rel:
            errors.append(f"{where}: empty path"); return
        if not os.path.isfile(os.path.join(public, rel)):
            errors.append(f"{where}: file not found: {public}/{rel}")

    check_bi(spec, "title", "guide")
    if "subtitle" in spec: check_bi(spec, "subtitle", "guide")

    steps = spec.get("steps") or []
    if not steps:
        errors.append("guide has no steps")
    vo_langs_per_step = []
    for i, s in enumerate(steps, 1):
        w = f"step {i}"
        m = s.get("media") or {}
        if m.get("type") not in ("image", "video"):
            errors.append(f"{w}: media.type must be 'image' or 'video'")
        for l, src in per_lang(m.get("src")).items():
            check_file(src, f"{w} media ({l})")
        if m.get("type") == "video" and "zoom" in m:
            warnings.append(f"{w}: zoom is ignored for video steps")
        if m.get("type") == "video" and "startSec" in m and "endSec" in m and m["endSec"] <= m["startSec"]:
            errors.append(f"{w}: endSec must be greater than startSec")

        check_bi(s, "caption", w)
        check_bi(s, "narration", w, required=False)
        if "narration" not in s:
            warnings.append(f"{w}: no narration text (recording script will fall back to the caption)")
        for l in LANGS:
            cap = (s.get("caption") or {}).get(l, "")
            if len(cap.split()) > MAX_CAPTION_WORDS:
                warnings.append(f"{w}: {l} caption has {len(cap.split())} words; consider shortening")

        vo = s.get("voiceover") or {}
        vo_langs_per_step.append(frozenset(l for l in LANGS if vo.get(l)))
        for l in LANGS:
            if vo.get(l): check_file(vo[l], f"{w} voiceover ({l})")

        for l, hls in per_lang(s.get("highlights") or []).items():
            for j, h in enumerate(hls or [], 1):
                for k in ("x", "y", "w", "h"):
                    v = h.get(k)
                    if not isinstance(v, (int, float)) or not 0 <= v <= 100:
                        errors.append(f"{w} highlight {j} ({l}): '{k}' must be a number 0-100")
                if all(isinstance(h.get(k), (int, float)) for k in "xywh"):
                    if h["x"] + h["w"] > 100.5 or h["y"] + h["h"] > 100.5:
                        errors.append(f"{w} highlight {j} ({l}): box goes off the frame")
                if h.get("shape", "box") not in ("box", "circle"):
                    errors.append(f"{w} highlight {j} ({l}): shape must be box or circle")
        if s.get("captionPosition", "bottom") not in ("top", "bottom"):
            errors.append(f"{w}: captionPosition must be top or bottom")

    for l in LANGS:
        has = [l in x for x in vo_langs_per_step]
        if any(has) and not all(has):
            missing = [str(i + 1) for i, h in enumerate(has) if not h]
            warnings.append(f"{l} voiceover missing for step(s) {', '.join(missing)}")

    for e in errors: print("ERROR  ", e)
    for x in warnings: print("WARNING", x)
    if not errors:
        print(f"OK: '{gid}' ({len(steps)} steps) is ready to render" + (" (with warnings)" if warnings else ""))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
