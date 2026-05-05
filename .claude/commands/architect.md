# architect

Run the architect agent to review code structure and architecture.

## Usage

```
/architect <file-path>
```

## Behavior

- Reviews file and component structure for architectural correctness
- Checks separation of concerns (data vs UI vs routes)
- Identifies business logic in JSX components
- Validates generateStaticParams() usage
- Finds hardcoded strings that should come from lib files
- Checks isValidSuburb() usage
- Validates static export compatibility
- Reports issues with file names and line numbers
- Does not fix anything — reports first, waits for instruction

## Example

```
/architect app/[niche]/page.jsx
```

## Output

- File being reviewed
- Violation type (separation of concerns, business logic in JSX, etc.)
- Specific issue with file name and line number
- Current problematic code
- Expected correct pattern
- Impact on static export or maintainability
- Priority issues (critical, high, medium, low)
- Specific recommendations with exact file and line numbers
- Code examples of correct patterns
- Refactoring suggestions
