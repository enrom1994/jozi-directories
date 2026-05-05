# seo

Run the SEO & AEO auditor agent on a specified page file.

## Usage

```
/seo <page-path>
```

## Behavior

- Runs the seo-aeo-auditor agent on the specified page file
- Checks for generateMetadata() implementation
- Reviews LocalBusiness JSON-LD schema with correct fields
- Validates Open Graph tags
- Checks canonical URL using BASE_URL from lib/config.js
- Analyzes suburb and niche keywords in headings and meta
- Reviews AEO answer-format content blocks (FAQ sections, direct answer paragraphs)
- Reports all missing or incorrect items
- Does not fix anything — reports first, waits for instruction

## Example

```
/seo app/[niche]/[suburb]/page.jsx
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
