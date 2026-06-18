# ChiragTax AI deployment guide

## Architecture
- Next.js 15 web app for the premium SaaS dashboard, authentication flows, upload center, analytics and admin panel.
- Firebase Authentication with custom role claims: `super_admin`, `admin`, `accountant`, `seller`.
- Firestore collections: `users`, `orders`, `payments`, `refunds`, `settlements`, `products`, `gst_reports`, `profit_reports`, `subscriptions`, `alerts`.
- Firebase Storage path: `uploads/{userId}/{marketplace}/{reportType}/{fileName}`.
- Cloud Functions parse uploaded CSV files, normalize marketplace schemas, run reconciliation, GST and profit engines, then write CA-ready reports.

## Setup
1. Create a Firebase project and enable Authentication, Firestore and Storage.
2. Add web app environment variables in `.env.local`: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
3. Deploy rules with `firebase deploy --only firestore:rules,storage`.
4. Deploy functions with `firebase deploy --only functions`.
5. Deploy the dashboard with `npm run build` and your preferred Next.js host.

## CSV import flow
1. User selects marketplace and report type in Upload Center.
2. File is uploaded to Firebase Storage with metadata for marketplace, report type and tenant.
3. Cloud Function validates headers, converts currency and dates, and writes normalized rows.
4. Engines update reconciliation summaries, GST reports, profit reports and alerts.

## Razorpay subscriptions
Store plans in `subscriptions` with `free`, `basic`, `pro` and `enterprise` tiers. Use Razorpay webhooks to update subscription status and role limits.
