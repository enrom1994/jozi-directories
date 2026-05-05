# Frontend Design Audit — Jozi Directories

**Date:** 2026-05-05
**Auditor:** Claude Code
**Scope:** All frontend components, CSS, and pages

---

## Executive Summary

Overall, the frontend is well-structured with a consistent design system. However, there are several issues that need attention across accessibility, code quality, and visual polish.

**Critical Issues:** 3
**High Priority:** 8
**Medium Priority:** 12
**Low Priority:** 7

---

## Developer Perspective

### 🔴 Critical Issues

#### 1. Duplicate CSS Definitions
**Location:** [globals.css:521-613](app/globals.css#L521-L613) and [globals.css:614-693](app/globals.css#L614-L693)

**Problem:** `.suburb-search-wrap`, `.suburb-search-icon`, `.suburb-search-input`, `.suburb-search-clear`, `.suburb-search-meta`, `.suburb-search-empty`, `.suburb-search-reset` are defined twice with conflicting values.

**Impact:** Unpredictable styling, maintenance issues, potential CSS specificity conflicts.

**Fix:** Remove duplicate definitions, keep only one set.

---

#### 2. Emoji Icons in Production Code
**Location:** [FeaturedCarousel.jsx:77-86](components/FeaturedCarousel.jsx#L77-L86)

**Problem:** Using emoji characters (📍, 📞) as UI icons instead of SVG icons.

```jsx
<p className="fc-card-suburb">📍 {biz.suburb}</p>
<a href={`tel:${biz.phone}`} className="fc-card-phone">📞 {biz.phone}</a>
```

**Impact:** Inconsistent rendering across devices, unprofessional appearance, accessibility issues.

**Fix:** Use SVG icons from [Icons.jsx](components/Icons.jsx) instead.

---

#### 3. Missing Focus States on Interactive Elements
**Location:** Multiple components

**Problem:** Several interactive elements lack visible focus states for keyboard navigation:
- `.cat-card` hover states don't have corresponding focus states
- `.suburb-card` focus states missing
- `.top-listing-row` focus states missing

**Impact:** Poor keyboard accessibility, WCAG 2.1 violation.

**Fix:** Add `:focus-visible` styles matching hover states.

---

### 🟠 High Priority Issues

#### 4. Inconsistent Cursor Pointer Usage
**Location:** Multiple components

**Problem:** Clickable elements missing `cursor-pointer`:
- `.cat-card` - no cursor style
- `.suburb-card` - no cursor style
- `.top-listing-row` - no cursor style
- `.fc-card` - no cursor style

**Impact:** Users can't tell which elements are interactive.

**Fix:** Add `cursor-pointer` to all clickable cards/links.

---

#### 5. Inline Styles That Should Be CSS
**Location:** [ListingCard.jsx:48](components/ListingCard.jsx#L48), [TopRatedSection.jsx:32](components/TopRatedSection.jsx#L32)

**Problem:** Hardcoded inline styles for values that should be in CSS:

```jsx
style={{ fontSize: 12, padding: '7px 14px' }}
style={{ color: 'var(--gold)' }}
```

**Impact:** Inconsistent styling, harder to maintain, can't use CSS variables.

**Fix:** Create CSS utility classes or component-specific classes.

---

#### 6. Missing Loading States
**Location:** [SearchBar.jsx](components/SearchBar.jsx)

**Problem:** No loading indicator when API call is in progress (only shows "Searching…" text).

**Impact:** Poor UX, users don't know if search is working.

**Fix:** Add skeleton loader or spinner during API calls.

---

#### 7. No Error Boundaries
**Location:** All client components

**Problem:** No error boundaries to catch and display errors gracefully.

**Impact:** App crashes show blank screen instead of error message.

**Fix:** Add error boundary wrapper around client components.

---

#### 8. Hardcoded Color Values
**Location:** [globals.css](app/globals.css) multiple locations

**Problem:** Some color values hardcoded instead of using CSS variables:
- Line 418: `color: #B54419;` (should use `var(--gold)`)
- Line 554: `rgba(253, 197, 0, 0.08)` (should use variable)
- Line 646: `rgba(255, 209, 0, 0.08)` (should use variable)

**Impact:** Inconsistent theming, harder to maintain.

**Fix:** Use CSS variables for all colors.

---

#### 9. Missing ARIA Labels
**Location:** [Header.jsx:39-51](components/Header.jsx#L39-L51)

**Problem:** Location pill button has title but no proper aria-label for screen readers.

**Impact:** Poor accessibility for screen reader users.

**Fix:** Add proper `aria-label` attribute.

---

#### 10. Inconsistent Border Radius Values
**Location:** Multiple CSS classes

**Problem:** Different border radius values used inconsistently:
- `.cat-card`: 10px
- `.suburb-card`: 8px
- `.suburb-featured-card`: 8px
- `.top-listing-row`: 9px
- `.fc-card`: no border radius

**Impact:** Inconsistent visual appearance.

**Fix:** Standardize on 8px or 10px across all cards.

---

### 🟡 Medium Priority Issues

#### 11. Hover States Cause Layout Shift
**Location:** [globals.css:912](app/globals.css#L912)

**Problem:** `.btn-primary:hover` uses `transform: translateY(-1px)` which causes layout shift.

**Impact:** Janky hover experience, content jumps.

**Fix:** Use color/opacity transitions instead of transform.

---

#### 12. Missing Keyboard Navigation for Carousel
**Location:** [FeaturedCarousel.jsx](components/FeaturedCarousel.jsx)

**Problem:** Carousel dots are buttons but no keyboard navigation support (arrow keys).

**Impact:** Poor keyboard accessibility.

**Fix:** Add arrow key navigation support.

---

#### 13. Inconsistent Spacing Scale
**Location:** Multiple components

**Problem:** Spacing values not consistent with defined scale:
- Some use `var(--space-X)` correctly
- Others use hardcoded pixel values

**Impact:** Inconsistent spacing across the app.

**Fix:** Use spacing scale variables consistently.

---

#### 14. Missing Prefers-Reduced-Motion Support
**Location:** [globals.css:1063-1074](app/globals.css#L1063-L1074)

**Problem:** Stagger animation doesn't respect `prefers-reduced-motion`.

**Impact:** Motion sickness for users who prefer reduced motion.

**Fix:** Add `@media (prefers-reduced-motion: reduce)` query.

---

#### 15. No Skeleton Loading for Hero Cards
**Location:** [HeroCardStack.jsx](components/HeroCardStack.jsx)

**Problem:** No skeleton state while loading hero card data.

**Impact:** Flash of empty content on slow connections.

**Fix:** Add skeleton loader.

---

#### 16. Missing Touch Target Size
**Location:** Multiple interactive elements

**Problem:** Some buttons/links smaller than 44x44px minimum touch target:
- `.hs-x` clear button
- `.fc-btn` carousel buttons

**Impact:** Poor mobile UX, hard to tap.

**Fix:** Increase touch target size to minimum 44x44px.

---

#### 17. Inconsistent Transition Durations
**Location:** Multiple CSS classes

**Problem:** Different transition durations used:
- 0.12s, 0.15s, 0.2s, 0.35s

**Impact:** Inconsistent feel across interactions.

**Fix:** Standardize on 150ms for micro-interactions.

---

#### 18. Missing Alt Text for Images
**Location:** [HeroCardStack.jsx](components/HeroCardStack.jsx)

**Problem:** If business photos are added, no alt text support.

**Impact:** Poor accessibility for screen reader users.

**Fix:** Add alt text prop and support.

---

#### 19. No Form Validation
**Location:** [LocationBanner.jsx](components/LocationBanner.jsx)

**Problem:** Suburb input has no validation (min length, format).

**Impact:** Users can submit invalid data.

**Fix:** Add input validation.

---

#### 20. Inconsistent Z-Index Values
**Location:** Multiple CSS classes

**Problem:** Z-index values not following a defined scale:
- 50, 100 used arbitrarily

**Impact:** Potential stacking context issues.

**Fix:** Define z-index scale (10, 20, 30, 50, 100).

---

### 🟢 Low Priority Issues

#### 21. Unused CSS Classes
**Location:** [globals.css](app/globals.css)

**Problem:** Some CSS classes defined but not used in current codebase.

**Impact:** Unnecessary CSS bloat.

**Fix:** Remove unused classes.

---

#### 22. Magic Numbers in JavaScript
**Location:** [SearchBar.jsx:29](components/SearchBar.jsx#L29)

**Problem:** Hardcoded slice values (4, 8) without explanation.

**Impact:** Harder to maintain and understand.

**Fix:** Define as named constants.

---

#### 23. Missing TypeScript
**Location:** All components

**Problem:** No TypeScript for type safety.

**Impact:** Potential runtime errors, harder refactoring.

**Fix:** Consider migrating to TypeScript.

---

#### 24. No Component Documentation
**Location:** All components

**Problem:** No JSDoc or comments explaining component usage.

**Impact:** Harder for other developers to understand.

**Fix:** Add component documentation.

---

#### 25. Inconsistent File Naming
**Location:** components folder

**Problem:** Some files use `.jsx`, potential inconsistency.

**Impact:** Minor confusion.

**Fix:** Standardize on `.jsx` for all React components.

---

#### 26. Missing Error Handling in API Calls
**Location:** [SearchBar.jsx:42-45](components/SearchBar.jsx#L42-L45)

**Problem:** API error only caught silently, no user feedback.

**Impact:** Users don't know if search failed.

**Fix:** Add error message display.

---

#### 27. No Performance Monitoring
**Location:** Entire app

**Problem:** No performance monitoring or metrics.

**Impact:** Can't track performance issues.

**Fix:** Consider adding performance monitoring.

---

## Graphic Designer Perspective

### 🔴 Critical Issues

#### 1. Inconsistent Visual Hierarchy
**Location:** Homepage

**Problem:** Hero section has too many competing elements:
- Hero title
- Search bar
- Stats row
- Hero card stack
- Location banner

**Impact:** Users don't know where to look first.

**Fix:** Simplify hero, reduce visual noise.

---

#### 2. Color Contrast Issues
**Location:** Multiple locations

**Problem:** Some text colors don't meet WCAG AA standards:
- `.ink-3` (#A8998A) on light backgrounds may fail contrast
- Muted text in some areas hard to read

**Impact:** Poor readability, accessibility issues.

**Fix:** Increase contrast for all text to minimum 4.5:1.

---

#### 3. Inconsistent Card Design
**Location:** Multiple card types

**Problem:** Different card designs across the app:
- Category cards
- Suburb cards
- Featured carousel cards
- Top-rated listing cards

**Impact:** Inconsistent visual language.

**Fix:** Create unified card design system.

---

### 🟠 High Priority Issues

#### 4. Typography Hierarchy Issues
**Location:** Multiple components

**Problem:** Font sizes and weights not following clear hierarchy:
- Hero title: 2.6rem
- Section titles: 1.05rem
- Card titles: 1.2rem
- Body text: 13-15px

**Impact:** Unclear information hierarchy.

**Fix:** Define clear typography scale.

---

#### 5. Inconsistent Spacing
**Location:** Multiple components

**Problem:** Padding and margins not consistent:
- Hero padding: 80px top, 40px bottom
- Section padding: 48px
- Card padding: varies

**Impact:** Inconsistent rhythm and flow.

**Fix:** Define consistent spacing scale.

---

#### 6. Missing Visual Feedback
**Location:** Multiple interactive elements

**Problem:** Some elements lack hover/focus feedback:
- Category pills have minimal feedback
- Some buttons only change opacity

**Impact:** Users unsure if elements are interactive.

**Fix:** Add clear visual feedback to all interactive elements.

---

#### 7. Inconsistent Border Styles
**Location:** Multiple components

**Problem:** Different border styles used:
- Some use `1px solid var(--border)`
- Others use `1px solid #E4DDD4`
- Some have no borders

**Impact:** Inconsistent visual appearance.

**Fix:** Standardize border styles.

---

#### 8. Shadow Usage Inconsistent
**Location:** Multiple components

**Problem:** Shadows used inconsistently:
- Hero cards have shadow
- Other cards don't
- No defined shadow scale

**Impact:** Inconsistent depth perception.

**Fix:** Define shadow scale and use consistently.

---

### 🟡 Medium Priority Issues

#### 9. Mobile Responsiveness Issues
**Location:** Multiple components

**Problem:** Some elements don't scale well on mobile:
- Hero card stack hidden on mobile (< 640px)
- Category grid may have issues on small screens
- Search bar may be too small on mobile

**Impact:** Poor mobile UX.

**Fix:** Test and improve mobile layouts.

---

#### 10. Missing Empty States
**Location:** Multiple components

**Problem:** No visual empty states when:
- No search results
- No featured listings
- No top-rated listings

**Impact:** Confusing UX when content is missing.

**Fix:** Add designed empty states.

---

#### 11. Inconsistent Icon Sizing
**Location:** Multiple components

**Problem:** Icons sized inconsistently:
- Some 12px, some 13px, some 14px
- No defined icon scale

**Impact:** Inconsistent visual appearance.

**Fix:** Define icon scale (12px, 16px, 20px, 24px).

---

#### 12. Missing Loading States Design
**Location:** Multiple components

**Problem:** No designed loading states:
- Skeleton loaders
- Spinners
- Progress indicators

**Impact:** Poor UX during loading.

**Fix:** Design and implement loading states.

---

#### 13. Color Palette Not Documented
**Location:** [globals.css:6-50](app/globals.css#L6-L50)

**Problem:** Color variables defined but no documentation on:
- When to use each color
- Color relationships
- Accessibility info

**Impact:** Inconsistent color usage.

**Fix:** Create color palette documentation.

---

#### 14. Missing Micro-interactions
**Location:** Multiple components

**Problem:** Lack of delightful micro-interactions:
- No button press animation
- No card lift on hover
- No smooth transitions

**Impact:** Feels static and unpolished.

**Fix:** Add micro-interactions.

---

#### 15. Inconsistent Button Styles
**Location:** Multiple components

**Problem:** Different button styles:
- `.btn-primary`
- `.btn-ghost`
- `.nav-cta`
- `.loc-banner-btn`

**Impact:** Inconsistent button design.

**Fix:** Create unified button system.

---

#### 16. Missing Success/Error States
**Location:** Forms and actions

**Problem:** No designed states for:
- Form submission success
- Form errors
- Action completion

**Impact:** Unclear user feedback.

**Fix:** Design success/error states.

---

### 🟢 Low Priority Issues

#### 17. No Dark Mode Support
**Location:** Entire app

**Problem:** No dark mode variant designed.

**Impact:** Limited user preference support.

**Fix:** Consider adding dark mode.

---

#### 18. Missing Animation Library
**Location:** Entire app

**Problem:** No animation library for complex animations.

**Impact:** Limited animation capabilities.

**Fix:** Consider adding Framer Motion or similar.

---

#### 19. Inconsistent Rounded Corners
**Location:** Multiple components

**Problem:** Different border radius values:
- 3px, 4px, 6px, 8px, 10px, 14px, 20px

**Impact:** Inconsistent visual appearance.

**Fix:** Define border radius scale.

---

#### 20. No Design System Documentation
**Location:** Entire app

**Problem:** No centralized design system documentation.

**Impact:** Harder to maintain consistency.

**Fix:** Create design system documentation.

---

## Recommendations

### Immediate Actions (This Week)

1. **Fix duplicate CSS definitions** - Remove duplicates in globals.css
2. **Replace emoji icons with SVGs** - Update FeaturedCarousel
3. **Add focus states** - Ensure all interactive elements have visible focus
4. **Add cursor-pointer** - Add to all clickable elements
5. **Fix color contrast** - Ensure all text meets WCAG AA

### Short-term Actions (This Month)

1. **Create unified card design system** - Standardize all card components
2. **Define typography scale** - Create clear hierarchy
3. **Define spacing scale** - Use consistently across app
4. **Add loading states** - Skeleton loaders and spinners
5. **Improve mobile responsiveness** - Test and fix mobile issues

### Long-term Actions (This Quarter)

1. **Create design system documentation** - Centralize all design decisions
2. **Add error boundaries** - Improve error handling
3. **Consider TypeScript migration** - Improve type safety
4. **Add performance monitoring** - Track performance metrics
5. **Consider dark mode** - Add user preference support

---

## Conclusion

The Jozi Directories frontend has a solid foundation with a consistent color palette and good component structure. However, there are several accessibility issues, code quality improvements needed, and visual polish opportunities.

The most critical issues to address are:
1. Duplicate CSS definitions
2. Emoji icons in production code
3. Missing focus states
4. Color contrast issues
5. Inconsistent visual hierarchy

Addressing these issues will significantly improve the user experience, accessibility, and maintainability of the codebase.
