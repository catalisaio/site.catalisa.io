# Native site localization

The new public site has its own source-text dictionaries. It does not reuse the old WhatsApp marketing copy, translate the DOM, load a third-party widget or send visitor content to a translation service.

`loadSiteLocale(locale)` must complete before importing/preparing native page modules: those modules translate their static editorial arrays and JSON data at module initialization. The language picker must use a document navigation when changing languages. Public navigation in the current language can use `LocalizedLink`; `useSiteLocation()` exposes the original Portuguese base route to existing page selectors.

- `t(source, values?)` translates UI text in the active locale. Leading/trailing whitespace and named `{value0}` placeholders survive. Portuguese source is the fallback, and missing strings are visible to QA with `getMissingSiteTranslations()`.
- `installSiteMessages(locale, messages)` plus `translateForLocale(locale, source, values?)` supports Node metadata/OG generation without changing the browser locale. The runtime has no Node filesystem dependency.
- `localizeData(data)` creates a cached copy of **static editorial JSON**. Do not pass visitor messages, briefings, generated concepts, requests or responses. Object keys, routes, slugs, contract bodies, API examples and product names stay intact.
- Category/status/domain/name fields are preserved by default because they also drive lookup and filtering. Translate their human labels at render time. Select options must retain the original `value` while their visible label is translated. Capture galleries explicitly opt in to translating `type` and `origin`; source references and filenames remain intact.
- Dictionaries are lazy per language. Disabled languages and missing dictionary files reject loading rather than pretending the page is translated. A newer language choice wins over a late earlier request.

The frozen extraction is `docs/redesign-2026-10-22/qa/localization/source-catalog.json` (4029 source strings). `source-additions.json` adds 125 reviewed UI/editorial strings found in the integration audit. The picker and trusted frontend validation add their own source-picker-additions.json and source-validation-additions.json catalogs. These files are source inventories, not visual or linguistic approval. Dictionary coverage checks automatically combine all source*-additions.json files (4160 distinct keys in the current snapshot). The LanguagePicker remains an isolated component until header integration; its anchors change language by document navigation, preserving only public UTM attribution and fragment IDs found on the current page.

```sh
node --experimental-vm-modules scripts/localize-runtime-check.mjs
node scripts/localize-coverage.mjs
```

The first command verifies the actual runtime in an isolated VM, without a browser/network/build. The second verifies 100% dictionary-key coverage, placeholder identity, URLs, email addresses, HTML markup and the Catalisa name. Translation quality, real DOM language coverage, responsive fit, legal review, routing, canonical/hreflang and generated concept language require release checks separately.

`scripts/localize-codemod.mjs` was applied once after a dry run and checks for preserved attributes, comparisons, imports and code examples. `scripts/localize-data-imports.mjs` applied static-data/navigation integration. `scripts/localize-dynamic.mjs` records a one-time audited editorial migration and refuses to replay it over the current incremental catalog. Do not rerun a global mutation while another agent owns App/PreviewMeta/Consent.

Known boundaries: HTML before/after fragments in financial-messaging.json are editorial provenance rather than rendered UI; their public final copy is in the native pages. Product/block names and visitor-provided/generated content retain their own text. A previously generated Portuguese concept does not become English by opening a localized page; the concept API must generate in the chosen language or explicitly represent its original language.
