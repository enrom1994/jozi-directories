# audit

Run the code-auditor agent on a specified file.

## Usage

```
/audit <file-path>
```

## Behavior

- Runs the code-auditor agent on the specified file
- Reports all issues with file name and line number
- Does not fix anything — reports first, waits for instruction
- Returns prioritized list of issues (critical, high, medium, low)
- Provides summary statistics

## Example

```
/audit components/ListingCard.jsx
```

## Output

- File being audited
- Issue type and severity
- Specific line numbers
- Current problematic code
- Why it's an issue
- Recommended action
- Prioritized issues list
- Summary statistics
