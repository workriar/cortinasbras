# Next.js Transformation Plan - Cortinas Brás

The goal is to migrate the existing Flask application to a modern Next.js project. This will improve performance, SEO, and maintainability while keeping the premium design and existing functionalities.

## Proposed Changes

### [Core] [NEW] Next.js Project
- **Framework**: Next.js 14/15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Hooks (useState/useEffect)
- **Form Handling**: React Hook Form + Zod

### [Frontend Migration]
- Port the complex design from `index.html` into modular React components.
- Replace AOS with Framer Motion for smoother, more modern animations.
- Implement a responsive image gallery and hero carousel using Next.js `Image` component for optimization.

### [Backend & Database]
- Port Flask logic to Next.js API Routes (`/api/leads`, `/api/admin`).
- **Database**: Use Prisma or Drizzle for ORM. Since the project uses SQLite, we'll keep it for simplicity or upgrade to PostgreSQL if requested.
- **PDF Generation**: Replace ReportLab (Python) with `react-pdf` or a similar Node.js library to generate quotes on the fly.
- **Email**: Use `nodemailer` or an API like `Resend` to send emails with PDF attachments.

### [SEO & Tracking]
- Implement Next.js Metadata API for dynamic titles, descriptions, and OpenGraph tags.
- Re-integrate Google Ads (gtag) and Meta Pixel.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure no build errors.
- Test API routes with Postman or a simple script.

### Manual Verification
1. Verify that the landing page looks identical or better than the original.
2. Submit a lead and check:
    - If the lead is saved in the database.
    - If the PDF is generated correctly.
    - If the email is sent with the PDF.
    - If the WhatsApp link works as expected.
3. Check the Admin Dashboard responsiveness and data display.
4. Verify SEO tags and tracking codes in the browser console.
