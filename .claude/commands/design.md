# design

Run the designer agent on the component I specify. Give a critique of the current design before suggesting any changes. No code yet — critique first.

## Usage

```
/design <component-path>
```

## Behavior

- Reviews the current component for design issues
- Provides specific feedback on visual hierarchy, mobile-first layout, color palette usage, typography, spacing, and conversion psychology
- Returns a critique and suggested approach
- Does not write any code — reports first, waits for instruction

## Example

```
/design components/ListingCard.jsx
```

## Output

- What works well in the current design
- What needs improvement
- Specific issues with visual hierarchy, mobile layout, colors, typography, spacing, or conversion elements
- Suggested design recommendations
- Component structure suggestions
- CSS variable usage recommendations
- Typography hierarchy recommendations
- Mobile-first implementation approach
- Conversion optimization suggestions
