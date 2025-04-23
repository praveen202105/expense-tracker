# 💰 Next.js Expense Tracker

This is a Next.js project bootstrapped with create-next-app. It helps you track income and expenses with features like Google Authentication, PDF export, and insightful visualizations.

🔗 [Live Demo](https://praveen-expense-tracker.vercel.app/) https://praveen-expense-tracker.vercel.app/

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## Environment Variables
To run the app, create a .env.local file in the root directory and add the following:

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

```

## Features
🔐 Google Authentication – Secure login via NextAuth.js

➕ Add Transactions – Quickly log income and expenses

📅 Date Filtering – Filter records by date range

📄 Monthly PDF Export – One-click PDF generation using jsPDF

📊 Insights Dashboard – Visual breakdown of income vs expenses

## Tech Stack
Frontend: Next.js, React, Tailwind CSS

Auth: NextAuth.js

PDF Generation: jsPDF

Deployment: Vercel
