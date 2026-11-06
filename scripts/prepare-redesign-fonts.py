"""Lossless WOFF2 compression of the frozen TTF copies; never subset or change the ZIP.

Manual regeneration requires fonttools[woff] (fontTools + brotli). These are build
tools only; committed WOFF2 assets need no Python dependency in production.
"""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen

root = Path(__file__).resolve().parent.parent
rows = []


def checksum(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def glyph_data(font):
    glyph_set = font.getGlyphSet()
    result = []
    for name in font.getGlyphOrder():
        pen = RecordingPen()
        glyph_set[name].draw(pen)
        glyph = font["glyf"][name]
        instructions = bytes(glyph.program.getBytecode()) if hasattr(glyph, "program") else b""
        result.append((name, pen.value, instructions.hex()))
    return result


for index in range(3):
    source = root / f"public/redesign/inter-{index}.ttf"
    target = source.with_suffix(".woff2")
    original_hash = checksum(source)
    original = TTFont(source, recalcTimestamp=False)
    original.flavor = "woff2"
    original.save(target)
    restored = TTFont(target, recalcTimestamp=False)
    assert checksum(source) == original_hash, "Original TTF changed"
    assert original.getGlyphOrder() == restored.getGlyphOrder(), "Glyph set changed"
    assert original.getBestCmap() == restored.getBestCmap(), "Unicode mapping changed"
    assert original["hmtx"].metrics == restored["hmtx"].metrics, "Horizontal metrics changed"
    assert original["head"].unitsPerEm == restored["head"].unitsPerEm, "Units changed"
    assert glyph_data(original) == glyph_data(restored), "Outlines/components/instructions changed"
    tables = set(original.keys()) - {"GlyphOrder", "head", "glyf", "loca"}
    assert tables == set(restored.keys()) - {"GlyphOrder", "head", "glyf", "loca"}
    for tag in tables:
        assert original[tag].compile(original) == restored[tag].compile(restored), f"Table changed: {tag}"
    rows.append({"source": str(source.relative_to(root)), "target": str(target.relative_to(root)),
                 "sourceBytes": source.stat().st_size, "woff2Bytes": target.stat().st_size,
                 "sourceSha256": original_hash, "woff2Sha256": checksum(target),
                 "glyphCount": len(original.getGlyphOrder()), "verifiedLossless": True})
    original.close()
    restored.close()

report = {"generatedAt": datetime.now(timezone.utc).isoformat(),
          "scope": "Compression only, no subsetting; all glyph outlines/components, instructions, cmap, metrics and other font tables preserved. TTF and frozen ZIP unchanged.",
          "sourceBytes": sum(row["sourceBytes"] for row in rows),
          "woff2Bytes": sum(row["woff2Bytes"] for row in rows), "fonts": rows}
output = root / "docs/redesign-2026-10-22/qa/site-quality"
output.mkdir(parents=True, exist_ok=True)
(output / "font-compression.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({key: report[key] for key in ["sourceBytes", "woff2Bytes"]}))
