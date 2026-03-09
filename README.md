# Personal Tracker

A modern, animated personal finance tracking dashboard built to help individuals monitor their expenses, set budgets, and visualize their cash flow efficiently.

## 🚀 What I Built & Why I Made Certain Choices

I built a personal finance tracking application featuring a dashboard, transaction management, categorized spending breakdowns, and a budget simulator.

## 🚀 Live Demo

[View Live Application](https://personal-tracker-lemon.vercel.app/)

## ✨ Features

- **🔐 Secure Authentication** - Clerk integration with protected routes
- **📊 Animated Data Visualizations** - Interactive charts using shadcn/ui and Recharts
- **💳 Transaction Management** - Add, edit, and delete transactions with smooth sheet UI
- **🎯 Budget Tracking** - Set category budgets with visual progress indicators
- **📈 Trend Analysis** - Mini area charts showing income/expense trends
- **🎨 Custom Categories** - Create and manage personalized spending categories
- **📱 Responsive Design** - Optimized for mobile and desktop
- **✅ Form Validation** - Custom input components with Zod validation
- **🎭 Smooth Animations** - Framer Motion for delightful micro-interactions

### Key Technology Choices:

- **Next.js (App Router)**: Chosen for its performance, seamless edge-compatible routing, and built-in optimization tools.
- **Clerk Authentication**: Integrated for drop-in, secure, and robust session management. It handles edge cases effortlessly and integrates smoothly with Next.js middleware to protect private routes.
- **Sanity CMS**: Selected as the headless CMS to act as the database. It provides a built-in Studio interface for manual data management if needed.
- **TanStack Query (React Query)**: Used on the client side to fetch, cache, and mutate data. This enables snappy optimistic UI updates when users add or delete transactions.
- **Tailwind CSS & Shadcn UI**: For fully responsive styling.
- **Framer Motion & Recharts**: Used to add micro-animations and dynamic data visualizations that make the financial data easily digestible.

## 🕰️ Time Spent

- **Approximately 3 days**

## 💡 What I'd Improve with More Time

Given more time, I would focus on the following enhancements:

### 1. **Light/Dark Mode Toggle** 🌓

```typescript
// Theme implementation using next-themes
- System preference detection
- Smooth transition animations between modes
- Persistent user preference storage
- Custom color palettes optimized for both themes
- Chart color schemes that adapt to theme
```

### 2. **AI-Powered Financial Assistant** 🤖

```typescript
// Integration with OpenAI/Anthropic API using Vercel AI SDK
Features:
- Natural language transaction entry ("I spent $45 on groceries")
- Smart categorization suggestions based on description
- Spending pattern analysis and insights
- Budget recommendations based on historical data
- Conversational chat interface for financial queries
```

## 🏗️ Architecture Decisions

### Why Sanity CMS Over localStorage?

While the original brief suggested localStorage or any similar alternative, I chose to implement **Sanity CMS** as the backend for several strategic reasons:

1. **Demonstrate Full-Stack Proficiency** - Showcase complete CRUD operations with a real headless CMS
2. **Production-Ready Solution** - Sanity provides a scalable, secure backend suitable for real-world applications
3. **Data Relationships** - Better handling of complex relationships between users, transactions, categories, and budgets
4. **Multi-Device Sync** - Data persists across devices and sessions (not limited to a single browser)
5. **Content Management** - Easy management of categories, settings, and user data through Sanity Studio

### Challenges Faced with Sanity

**1. Schema Design Complexity**

- **Challenge:** Designing normalized schemas for transactions, categories, and budgets with proper references
- **Solution:** Created well-structured schemas with type safety and validation at the CMS level

**2. Query Performance**

- **Challenge:** Fetching related data efficiently (transactions with category details)
- **Solution:** Used GROQ queries with projections to fetch only necessary fields and reduce payload size

**3. User-Specific Data Filtering**

- **Challenge:** Ensuring users only see their own transactions and budgets
- **Solution:** Implemented server-side filtering using Clerk user IDs in Sanity queries

**4. Authentication Integration**

- **Challenge:** Connecting Clerk auth with Sanity data access control
- **Solution:** Created middleware to validate users and pass authenticated user context to Sanity queries

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Clerk account and API keys
- Sanity project setup

### Setup Steps

1. **Clone the repository**

```bash
   git clone https://github.com/JohnOmoseni/personal-tracker.git
   cd personal-tracker
```

2. **Install dependencies**

```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
```

3. **Environment Variables**

   Create a `.env.local` file in the root directory:

```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=clerk_publishable_key
   CLERK_SECRET_KEY=clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Sanity CMS
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=development
   SANITY_API_TOKEN=your_api_token
```

4. **Run Sanity Studio (optional - for content management)**

```bash
   cd sanity-studio
   npm install
   npm run dev
```

5. **Start the development server**

```bash
   npm run dev
```
