# Pattern: n8n → GitHub API commit (bypassing env var restriction)

## Problem
n8n self-hosted on Fly.io blocks `$env` in HTTP Request node expressions
(`N8N_BLOCK_ENV_ACCESS_IN_NODE=true` by default).
`$vars` requires the n8n Variables UI which may not be available.

## Solution
Read `process.env.*` inside a **Code node** (always permitted),
then pass values as regular JSON fields through the pipeline.
HTTP Request nodes use `$json.fieldName` — no `$env` needed in expressions.

## Implementation (in Code – Format Ingest Batch)
```js
const githubToken  = process.env.GITHUB_TOKEN  ?? '';
const githubRepo   = process.env.GITHUB_REPO   ?? '';
const githubBranch = process.env.GITHUB_BRANCH ?? 'main';
return [{ json: { ...batchData, githubToken, githubRepo, githubBranch } }];
```

HTTP node expressions then use:
```
URL:  ={{ 'https://api.github.com/repos/' + $json.githubRepo + '/contents/...' }}
Auth: ={{ 'Bearer ' + $json.githubToken }}
```

## Env vars set in Fly.io secrets
- GITHUB_TOKEN — fine-grained PAT, Contents read+write on the repo
- GITHUB_REPO  — owner/repo format e.g. enrom1994/jozi-directories
- GITHUB_BRANCH — main

## GitHub Contents API flow
1. GET /repos/{owner}/{repo}/contents/{path} (neverError: true)
2. Code node: decode base64, merge+dedup by _place_id, re-encode
3. PUT /repos/{owner}/{repo}/contents/{path} with { message, content, sha?, branch }
   - sha is omitted on first write (new file), included on updates

## Result
n8n commits directly to GitHub → Vercel auto-deploys → live site updated.
No ngrok, no filesystem writes, no /api/ingest endpoint needed.

## Project
jozi-directories — Directory Scraper V1.3
