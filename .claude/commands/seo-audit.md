# seo-audit

Run the SEO & AEO auditor agent on a Next.js page file.

## Usage

```
/seo-audit <page-path>
```

## Behavior

- Audits the page for SEO and AEO best practices
- Checks generateMetadata() implementation
- Reviews LocalBusiness JSON-LD schema
- Validates Open Graph tags and canonical URLs
- Analyzes keyword optimization
- Checks AEO content blocks (FAQ sections, direct answers)
- Reports missing or incorrect items
- Does not fix anything — reports first, waits for instruction

## Example

```
/seo-audit app/[niche]/[suburb]/page.jsx
```

## Output

- Page being audited
- Missing SEO elements (with specific field names)
- Incorrect SEO elements (with current vs expected values)
- Missing AEO content blocks
- Schema markup issues
- Keyword optimization gaps
- Technical SEO issues
- Priority recommendations (critical, high, medium, low)
- Specific fixes needed
