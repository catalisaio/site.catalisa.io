"""Build Latin WOFF2 faces from preserved TTFs; keep complete WOFF2 fallback faces.

Requires fontTools[woff]. No CSS, original fonts, brand kit or frozen ZIP writes.
"""
import hashlib
import json
import unicodedata
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen

root = Path(__file__).resolve().parent.parent
reference = root / "docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/reference/site/dist"
ranges = [(0x0000, 0x024F), (0x0300, 0x036F), (0x1E00, 0x1EFF),
          (0x2000, 0x206F), (0x20A0, 0x20CF), (0x2100, 0x214F), (0x2190, 0x21FF)]
latin_unicodes = {point for start, end in ranges for point in range(start, end + 1)}


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def css_ranges(values):
    return ", ".join(f"U+{start:04X}" if start == end else f"U+{start:04X}-{end:04X}" for start, end in values)


def complement(values):
    result, cursor = [], 0
    for start, end in values:
        if cursor < start:
            result.append((cursor, start - 1))
        cursor = end + 1
    if cursor <= 0x10FFFF:
        result.append((cursor, 0x10FFFF))
    return result


class TextCorpus(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip += 1
        for name, value in attrs:
            if name in ("alt", "title", "aria-label", "placeholder", "value") and value:
                self.parts.append(value)

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


corpus_sources, parts = [], []
html_files = sorted(file for file in reference.rglob("*.html") if file.name != "404.html")
assert len(html_files) == 69, "Expected69 final reference routes"
for file in html_files:
    parser = TextCorpus()
    parser.feed(file.read_text())
    parts.extend(parser.parts)
    corpus_sources.append(str(file.relative_to(root)))
# Include code/SVG text, states, Portuguese content and the financial copy added
# after the handoff. Source syntax contributes ASCII already in the fixed range.
for directory in [root / "src/redesign", reference / "assets"]:
    for file in sorted(directory.rglob("*")):
        if file.is_file() and file.suffix in (".tsx", ".ts", ".json", ".svg", ".css"):
            parts.append(file.read_text())
            corpus_sources.append(str(file.relative_to(root)))
corpus = "\n".join(parts)
characters = {ord(char) for char in corpus if char.isprintable() or unicodedata.category(char).startswith("M")}
# Common visible reference symbols belong in the first transfer too; otherwise
# one play/check/circle glyph would needlessly fetch the complete fallback font.
reference_symbols = {0x2161, 0x2212, 0x2260, 0x2265, 0x25B6, 0x25B7, 0x25CB, 0x25CF, 0x2713} & characters
# FontTools retains U+2264 as the bidi mirror of the reference's U+2265. Include
# that companion explicitly in the CSS range rather than hide its cmap entry.
reference_symbols.add(0x2264)
ranges = sorted(ranges + [(point, point) for point in reference_symbols])
latin_unicodes.update(reference_symbols)
rows = []


def outline(font, glyph_name):
    pen = RecordingPen()
    font.getGlyphSet()[glyph_name].draw(pen)
    return pen.value


for index in range(3):
    source = root / f"public/redesign/inter-{index}.ttf"
    full_woff = root / f"public/redesign/inter-{index}.woff2"
    target = root / f"public/redesign/inter-latin-{index}.woff2"
    source_hash, full_hash = sha(source), sha(full_woff)
    original = TTFont(source, recalcTimestamp=False)
    font = TTFont(source, recalcTimestamp=False)
    options = subset.Options()
    options.layout_features = ["*"]
    options.glyph_names = True
    options.hinting = True
    options.notdef_glyph = True
    options.notdef_outline = True
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=latin_unicodes)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(target)
    restored = TTFont(target, recalcTimestamp=False)
    original_map, restored_map = original.getBestCmap(), restored.getBestCmap()
    expected = {code: name for code, name in original_map.items() if code in latin_unicodes}
    assert restored_map == expected, "Subset changed Latin Unicode mapping"
    assert restored["head"].unitsPerEm == original["head"].unitsPerEm
    for field in ("ascent", "descent", "lineGap"):
        assert getattr(restored["hhea"], field) == getattr(original["hhea"], field), field
    for field in ("sTypoAscender", "sTypoDescender", "sTypoLineGap", "usWinAscent", "usWinDescent", "sxHeight", "sCapHeight"):
        if hasattr(original["OS/2"], field):
            assert getattr(restored["OS/2"], field) == getattr(original["OS/2"], field), field
    glyph_names = restored.getGlyphOrder()
    for name in glyph_names:
        assert restored["hmtx"].metrics[name] == original["hmtx"].metrics[name], (name, "metrics")
        assert outline(restored, name) == outline(original, name), (name, "outline/components")
        before, after = original["glyf"][name], restored["glyf"][name]
        if hasattr(before, "program"):
            assert bytes(before.program.getBytecode()) == bytes(after.program.getBytecode()), (name, "hinting")
    # Full WOFF2 must retain the same Unicode map as the untouched TTF source.
    complete = TTFont(full_woff, recalcTimestamp=False)
    assert complete.getBestCmap() == original_map, "Complete fallback cmap differs"
    assert sha(source) == source_hash and sha(full_woff) == full_hash, "Original/full font was changed"
    full_fallback = sorted(code for code in characters if code in original_map and code not in latin_unicodes)
    native_fallback = sorted(code for code in characters if code not in original_map)
    assert all(code in restored_map or code in complete.getBestCmap() for code in characters if code in original_map)
    rows.append({"weight": original["OS/2"].usWeightClass,
                 "source": str(source.relative_to(root)), "sourceSha256": source_hash,
                 "completeWoff2": str(full_woff.relative_to(root)), "completeWoff2Sha256": full_hash,
                 "completeBytes": full_woff.stat().st_size,
                 "latinWoff2": str(target.relative_to(root)), "latinWoff2Sha256": sha(target),
                 "latinBytes": target.stat().st_size, "glyphsPreserved": len(glyph_names),
                 "latinCmapEntries": len(restored_map), "outlinesComponentsHintingAndMetricsIdentical": True,
                 "originalAndCompleteFallbackUntouched": True,
                 "corpusCodepointsNeedingFullFace": [f"U+{code:04X}" for code in full_fallback],
                 "corpusCodepointsAlreadyAbsentFromOriginal": [f"U+{code:04X}" for code in native_fallback]})
    for font_object in (original, font, restored, complete):
        font_object.close()

report = {"generatedAt": datetime.now(timezone.utc).isoformat(),
          "scope": "Latin subsetting only. Original TTF/full WOFF2, brand, ZIP, reference and CSS unchanged. Corpus coverage includes69 reference routes plus code/SVG/data/Portuguese/new financial messages. Full faces must use complementary unicode-range.",
          "latinUnicodeRange": css_ranges(ranges), "completeFaceComplementUnicodeRange": css_ranges(complement(ranges)),
          "referenceSymbolsIncluded": [f"U+{point:04X}" for point in sorted(reference_symbols)],
          "corpus": {"referenceRoutes": len(html_files), "sourceFiles": len(corpus_sources),
                     "sha256": hashlib.sha256(corpus.encode()).hexdigest(), "uniquePrintableOrCombiningCodepoints": len(characters),
                     "sources": corpus_sources},
          "completeWoff2Bytes": sum(row["completeBytes"] for row in rows),
          "latinWoff2Bytes": sum(row["latinBytes"] for row in rows), "fonts": rows,
          "coverageVerified": "All corpus characters mapped by original TTF remain available through the Latin face or unchanged full-face complement. Characters missing from originals still require the existing native/system fallback.",
          "limits": ["No CSS modified or browser metrics measured here.", "OpenType layout features retained; shaping/kerning must be visually checked in the final browser artifact."]}
report["latinTransferReductionPercent"] = round(100 * (1 - report["latinWoff2Bytes"] / report["completeWoff2Bytes"]), 2)
output = root / "docs/redesign-2026-10-22/qa/site-quality"
output.mkdir(parents=True, exist_ok=True)
(output / "font-subsets.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({key: report[key] for key in ("completeWoff2Bytes", "latinWoff2Bytes", "latinTransferReductionPercent", "latinUnicodeRange", "completeFaceComplementUnicodeRange")}))
