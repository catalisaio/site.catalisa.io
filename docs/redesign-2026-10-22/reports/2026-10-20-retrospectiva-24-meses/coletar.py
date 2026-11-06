import argparse
import collections
import datetime
import json
import pathlib
import subprocess
import time

ROOT = pathlib.Path('/tmp/catalisa-retrospectiva-20261020')
ROOT.mkdir(exist_ok=True)
REPOS = {
    'wpp': ('/home/klederson/Projects/wpp.bb.catalisa.io', 'catalisaio/wpp.bb.catalisa.io', 'master'),
    'bb': ('/home/klederson/Projects/building-blocks-v2', 'catalisaio/building-blocks-v2', 'main'),
    'developy': ('/home/klederson/Projects/developy.cloud', 'klederson/proxmox-manager', 'main'),
}
START = '2024-10-20T03:00:00+00:00'
END = '2026-10-21T03:00:00+00:00'

def run(args, cwd=None):
    result = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(str(args[:5]) + ': ' + result.stderr[:1800])
    return result.stdout

def save(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2))

def remote(key):
    local, repo, branch = REPOS[key]
    out = ROOT / key
    out.mkdir(exist_ok=True)
    meta = json.loads(run(['gh', 'repo', 'view', repo, '--json', 'nameWithOwner,defaultBranchRef,createdAt,updatedAt,url,description']))
    save(out / 'repository.json', meta)
    fields = 'number,title,body,createdAt,updatedAt,mergedAt,closedAt,state,url,author,baseRefName,headRefName,mergeCommit,additions,deletions,changedFiles,labels'
    cache = out / 'prs-all-private.json'
    if cache.exists():
        prs = json.loads(cache.read_text())
    else:
        prs = json.loads(run(['gh', 'pr', 'list', '--repo', repo, '--state', 'all', '--limit', '10000', '--json', fields]))
        save(cache, prs)
    branch = meta['defaultBranchRef']['name']
    run(['git', 'fetch', 'origin', '+refs/heads/' + branch + ':refs/remotes/origin/' + branch], local)
    release_text = run(['gh', 'api', 'repos/' + repo + '/releases?per_page=100', '--paginate'])
    releases = []
    decoder = json.JSONDecoder()
    while release_text.strip():
        page, consumed = decoder.raw_decode(release_text.lstrip())
        releases.append(page)
        release_text = release_text.lstrip()[consumed:]
    save(out / 'releases.json', [r for page in releases for r in page])
    print(json.dumps({'repo': key, 'prs': len(prs), 'default': branch, 'releases': sum(map(len, releases))}), flush=True)

def local(key):
    local, repo, branch = REPOS[key]
    out = ROOT / key
    meta = json.loads((out / 'repository.json').read_text())
    branch = meta['defaultBranchRef']['name']
    ref = run(['git', 'rev-parse', 'origin/' + branch], local).strip()
    default_shas = set(run(['git', 'rev-list', ref], local).splitlines())
    # Do not use --since: a historical clock anomaly can prune reachable history.
    raw = run(['git', 'log', '--all', '--format=%x1e%H%x1f%P%x1f%aI%x1f%cI%x1f%an%x1f%ae%x1f%s', '--name-status', '--no-renames'], local)
    commits = []
    messages_raw = run(['git', 'log', '--all', '--format=%H%x1f%B%x1e'], local)
    messages = {}
    for message in messages_raw.split('\x1e'):
        if '\x1f' in message:
            message_sha, body = message.strip().split('\x1f', 1)
            messages[message_sha] = body.strip()
    for block in raw.split('\x1e'):
        if not block.strip():
            continue
        header, _, rest = block.partition('\n')
        parts = header.split('\x1f', 6)
        if len(parts) != 7:
            raise ValueError(header[:150])
        sha, parents, authored, committed, author, email, title = parts
        stamp = datetime.datetime.fromisoformat(committed).astimezone(datetime.timezone.utc).isoformat()
        if not START <= stamp < END:
            continue
        files = []
        for line in rest.splitlines():
            fields = line.split('\t', 1)
            if len(fields) == 2:
                files.append({'status': fields[0], 'path': fields[1]})
        commits.append({'sha': sha, 'parents': parents.split(), 'authoredAt': authored, 'committedAt': committed, 'date': stamp[:10], 'author': author, 'email': email, 'title': title, 'body': messages.get(sha, title), 'integrated': sha in default_shas, 'files': files})
    save(out / 'commits-private.json', sorted(commits, key=lambda c: c['committedAt']))
    files = run(['git', 'ls-tree', '-r', '--long', ref], local)
    tree = []
    docs = []
    modules = collections.Counter()
    for line in files.splitlines():
        info, path = line.split('\t', 1)
        mode, kind, sha, size = info.split()
        tree.append({'path': path, 'sha': sha, 'bytes': int(size) if size != '-' else 0})
        if (path.lower().endswith(('.md', '.mdx', '.rst', '.adoc')) and not any(p in path.lower() for p in ['node_modules', 'package-lock', '.claude/', '.agents/', '.codex/'])):
            content = run(['git', 'show', ref + ':' + path], local)
            headings = [s.strip() for s in content.splitlines() if s.startswith('#')][:30]
            docs.append({'path': path, 'sha': sha, 'headings': headings, 'bytes': len(content.encode())})
    save(out / 'tree.json', tree)
    save(out / 'docs.json', docs)
    snapshot = {'repo': repo, 'defaultBranch': branch, 'sha': run(['git', 'rev-parse', ref], local).strip(), 'head': run(['git', 'log', '-1', '--format=%cI %s', ref], local).strip(), 'firstCommit': run(['git', 'log', '--reverse', '--format=%cI %s', ref], local).splitlines()[0], 'shallow': run(['git', 'rev-parse', '--is-shallow-repository'], local).strip(), 'collectedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'windowStart': START, 'windowEndExclusive': END, 'commits': len(commits), 'integratedCommits': sum(c['integrated'] for c in commits), 'files': len(tree), 'docs': len(docs)}
    save(out / 'snapshot.json', snapshot)
    print(json.dumps(snapshot, ensure_ascii=False), flush=True)

def verify_remote(key):
    local, repo, branch = REPOS[key]
    owner, name = repo.split('/')
    query = 'query { repository(owner: "' + owner + '", name: "' + name + '") { pullRequests(first: 1, orderBy: {field: CREATED_AT, direction: DESC}) { totalCount nodes {number createdAt} } } }'
    result = json.loads(run(['gh', 'api', 'graphql', '-f', 'query=' + query]))
    result['checkedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    save(ROOT / key / 'pagination-check.json', result)
    print(json.dumps({'repo': key, **result}), flush=True)

parser = argparse.ArgumentParser()
parser.add_argument('mode', choices=['remote', 'local', 'verify'])
parser.add_argument('repos', nargs='*', default=list(REPOS))
args = parser.parse_args()
for key in args.repos:
    {'remote': remote, 'local': local, 'verify': verify_remote}[args.mode](key)
