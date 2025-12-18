# Premium UX/UI Upgrade Plan

This plan aims to elevate the application to a high-end, premium experience for "Cortinas Brás", focusing on visual excellence, sophisticated interactions, and a superior PDF output.

## User Review Required
> [!IMPORTANT]
> I am introducing a new font, **Outfit**, for headings to complement the existing **Inter** body font. This pair is widely used in luxury and modern tech brands.

## Proposed Changes

---

### Design System & Global Styles
#### [MODIFY] layout.tsx (file:///root/next-app/src/app/layout.tsx)
- Import **Outfit** font from Google Fonts.
- Apply `font-outfit` to headings.

#### [MODIFY] globals.css (file:///root/next-app/src/app/globals.css)
- Add more sophisticated glassmorphism utilities.
- Refine the custom scrollbar and add a scroll progress bar.
- Add smoother transition defaults for all interactive elements.

---

### UI Components
#### [MODIFY] Hero.tsx (file:///root/next-app/src/components/Hero.tsx)
- Upgrade the **"Gerar PDF & Email"** button with a better design, perhaps an icon and a subtle glow effect.
- Add a floating animation to the promo images.
- Improve typography scale for better hierarchy.

#### [NEW] PremiumToast.tsx (file:///root/next-app/src/components/PremiumToast.tsx)
- Create a custom toast component using `framer-motion` for elegant success/error notifications.

---

### PDF Generation
#### [MODIFY] pdf.ts (file:///root/next-app/src/services/pdf.ts)
- Switch from `pdfkit` to the `generatePdf` (Puppeteer) approach for the main budget output.
- Create an HTML/Tailwind template that looks like a high-end physical document, including:
    - Gold-foil stylings (digital representation).
    - Professional layout with better spacing.
    - High-quality font rendering.

---

### Verification Plan
#### Automated Tests
- Run `npm run build` to ensure no regressions in typing or styles.
- Verify PDF generation via `curl` with the new HTML template.

#### Manual Verification
- Test the scroll progress bar by scrolling through the page.
- Trigger the PDF generation and verify the new "Premium Toast" feedback.
- Open the generated PDF and verify the new high-end design.
