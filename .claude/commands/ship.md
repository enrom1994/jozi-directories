# ship

Run a pre-ship check on jozi-directories before deploying.

## Usage

```
/ship
```

## Behavior

- Verifies Next.js build passes (`npm run build`)
- Checks for console.log statements in production code
- Confirms all dynamic routes have generateStaticParams()
- Confirms CLAUDE.md is up to date with any new patterns added this session
- Reports results of all checks

## Checks Performed

**Build Verification:**
- Runs `npm run build` to ensure static export succeeds
- Reports any build errors or warnings

**Console.log Check:**
- Scans all files for console.log statements
- Reports any found with file names and line numbers

**generateStaticParams() Check:**
- Verifies all dynamic routes in app/[niche]/ and app/[niche]/[suburb]/ have generateStaticParams()
- Reports any missing implementations

**CLAUDE.md Check:**
- Reviews CLAUDE.md for completeness
- Checks if any new patterns from this session need to be documented
- Reports any missing documentation

## Output

- Build status (pass/fail with details)
- Console.log findings (if any)
- generateStaticParams() status (pass/fail with details)
- CLAUDE.md status (up to date/needs updates)
- Overall ship readiness assessment
- Any issues that need to be resolved before shipping
