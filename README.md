# Personal Tracker

A modern, highly animated personal finance tracking dashboard built to help individuals monitor their expenses, set budgets, and visualize their cash flow efficiently.

## 🚀 What I Built & Why I Made Certain Choices

I built a comprehensive personal finance tracking application featuring an intuitive dashboard, transaction management, categorized spending breakdowns, and a budget simulator.

### Key Technology Choices:

- **Next.js (App Router)**: Chosen for its performance, seamless edge-compatible routing, and built-in optimization tools. It allows fluid hybrid rendering (Server Components for auth/actions and Client Components for interactive charts).
- **Clerk Authentication**: Integrated for drop-in, secure, and robust session management. It handles edge cases effortlessly and integrates smoothly with Next.js middleware to protect private routes.
- **Sanity CMS**: Selected as the headless CMS to act as our primary database. It provides an incredible developer experience for designing schemas (users, transactions, budgets, categories) without the overhead of maintaining a traditional relational database, while also providing a built-in Studio interface for manual data management if needed.
- **TanStack Query (React Query)**: Used on the client side to fetch, cache, and mutate data. This enables snappy optimistic UI updates when users add or delete transactions.
- **Tailwind CSS & Shadcn UI**: For rapid, consistent, and fully responsive styling.
- **Framer Motion & Recharts**: Used to add premium micro-animations and beautiful, dynamic data visualizations that make the financial data easily digestible.

## 🕰️ Time Spent

- **Approximately 3 days**

## 💡 What I'd Improve with More Time

Given more time, I would focus on the following enhancements:

1. **Full CRUD Capabilities**: While create, read, and delete flows are implemented, adding full "Edit" flows across all entities (transactions, categories, budgets) would complete the UX loop.
2. **Advanced Analytics & Reporting**: Adding features to generate and download PDF summaries of monthly spending behaviors, or tax-season export sheets.
3. **Enhanced Data Visualizations**: Adding pie-charts with drill-down views or year-over-year comparative line charts for deeper financial insights.
4. **Comprehensive Testing**: Introducing unit tests (e.g., Jest/Vitest) and End-to-End tests (e.g., Cypress or Playwright) to guarantee reliability during major refactors.

## 🧗 Challenges Faced

During the development process, a few interesting challenges arose:

2. **Dynamic Chart Styling**: Recharts requires JavaScript-based styling tokens, which sometimes conflict with Tailwind's utility classes. Getting the linear gradients, tooltips, and responsive sizing to look perfect and adapt gracefully to both light and dark modes required careful SVG structure manipulation.
3. **Optimistic UI Caching**: Getting TanStack Query to immediately reflect added or deleted transactions in the main dashboard UI, ensuring that newly added categories instantly appear in selection dropdowns without requiring full page reloads.
