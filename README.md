# Shree Krishna Restaurant (Firebase)

## Folder Structure

```
.
├── public/
│   ├── index.html
│   ├── menu.html
│   ├── about.html
│   ├── reservations.html
│   ├── contact.html
│   ├── blog.html
│   ├── admin.html
│   └── assets/
│       ├── css/styles.css
│       └── js/
│           ├── firebase-init.js
│           ├── app.js
│           ├── reservations.js
│           └── admin.js
├── firebase.json
├── .firebaserc
├── firestore.rules
└── storage.rules
```

## Firebase Setup

1. Create Firebase project.
2. Enable Authentication > Email/Password.
3. Enable Firestore (production mode).
4. Enable Storage.
5. Update `public/assets/js/firebase-init.js` with your Firebase config.
6. Update `.firebaserc` default project id.

## Create Admin

1. Open `/admin`.
2. Click **Create First Admin**.
3. Enter email + password.
4. Account is inserted in `admins/{uid}` and can access all admin modules.

## Deploy

```bash
npm i -g firebase-tools
firebase login
firebase deploy
```

## Branding Changes

- Global style variables and look: `public/assets/css/styles.css`.
- Dynamic text/content/logo/contact/opening hours/FAQ/hero/SEO: Admin panel > CMS + SEO.
- Navigation labels/page layout: HTML files in `public/*.html`.
- Restaurant name/cuisine/city defaults: set through Admin CMS fields.

