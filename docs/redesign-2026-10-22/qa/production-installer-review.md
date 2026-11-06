# Private production candidate installer review

Prepared `scripts/site-production-install.mjs` for the existing immutable production/staging pair `20261026-seo-final`. This installer changes only the isolated production candidate in CT154. It does not cut over the public edge, change DNS, or operate the panel/building-block applications.

Default mode is a local-only plan. It requires `--release`, `--staging-release` and `--env-file`; the source environment file must be named `production-runtime.env`, be mode600 and live outside both release/build contexts. Plan mode verifies the complete file lists and hashes, the public/server tree digests, the production preflight, and the exact staging/production artifact match. No child process or network connection starts in plan mode.

`--apply=true` additionally requires `--approval-record=PRIVATE_JSON`. This regular mode600 file must also live outside the release directories. Required fields are `releaseId`, `userAuthorizedProduction:true`, `stagingValidated:true`, nonempty `userMessage`, `stagingEvidence` (nonempty text or a list of evidence strings), ISO-compatible `authorizedAt`, `publicArtifactSha256`, `serverArtifactSha256` and `releaseManifestSha256`. The message and evidence must be recorded from actual authorization and staging validation; this review is not an approval record.

Current production release manifest digest: `8c682364867280c816abafee740a9f43dcbba0d71c7cc1ab67a066bd89b0e144`.

Application uses fixed SSH destination `root@177.104.184.34`, CT154 and `/opt/apps/catalisa-site-production`. Environment and approval files travel separately from the release archive, stay outside Docker's context and are never printed. An existing runtime must match byte-for-byte; the installer refuses an implicit configuration migration. Remote verification rechecks the approved manifest digest, all files, unexpected files and symlinks before the existing activation script runs with `SITE_PRODUCTION_APPROVAL=releaseId`. Existing activation readiness checks restore the previous private candidate on startup/readiness failure. A failed immutable candidate remains available for diagnosis rather than being silently overwritten.

Validation performed: source review and `node --check scripts/site-production-install.mjs` passed. No plan, application, SSH, Docker build, npm invocation, edge change or deployment was executed by this task. Root must run the local plan, obtain the actual approval record, install/validate the private candidate and handle any separately authorized public cutover.
