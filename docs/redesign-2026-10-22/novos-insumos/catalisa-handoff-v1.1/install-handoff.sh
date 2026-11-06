#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -ne 1 ]; then echo 'Uso: bash install-handoff.sh /caminho/do/repo'; exit 2; fi
handoff_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
python3 - "$handoff_dir" "$1" <<'INSTALL'
from pathlib import Path
import sys,shutil
src=Path(sys.argv[1]).resolve();repo=Path(sys.argv[2]).resolve()
if not repo.is_dir():raise SystemExit('O destino precisa ser um diretório existente.')
if repo==src or src in repo.parents:raise SystemExit('Escolha um repo fora do pacote.')
doc=repo/'docs/catalisa-handoff-2026-10-22';ref=repo/'reference/catalisa-site-v1.1'
if doc.exists() or ref.exists():raise SystemExit('Destino já existe. Nada foi sobrescrito; revise o handoff anterior.')
# Resolve symlinked parents and reject import paths escaping the selected repo.
for target in [doc,ref]:
 resolved=target.resolve()
 if repo not in resolved.parents:raise SystemExit('Destino sai do repo por um symlink. Nada foi copiado.')
for path in [doc,ref]:path.parent.mkdir(parents=True,exist_ok=True)
shutil.copytree(src,doc,ignore=shutil.ignore_patterns('reference','install-handoff.sh'))
shutil.copytree(src/'reference/site',ref)
(doc/'ONDE-ESTA-A-REFERENCIA.md').write_text('A referência executável está em reference/catalisa-site-v1.1 na raiz do repo. Os caminhos reference/site deste pacote original devem ser lidos com esse mapeamento. Para rodar a validação incluída sem ajustes, execute-a no pacote original.\n')
print('Documentação:',doc);print('Referência:',ref);print('AGENTS.md, CLAUDE.md e código existentes não foram alterados. Nenhum commit ou deploy foi executado.')
INSTALL
