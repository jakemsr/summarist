# Summarist

[**Live Site**](https://summarist-eight.vercel.app/)

### Description
Subscription service for reading or listening to summaries of popular books.

### Tech Stack
React, NextJS, TailwindCSS, Redux Tool Kit, Firebase Auth & Firestore, Stripe

### Why
This project was part of my front end course. There was a lot of learning in this project. One particular issue was loading audio file metadata. NextJS wants to render as much as possible on the server side and this can cause a race condition where the metadata loading gets missed. The fix is to employ useEffect hooks to check if data has been loaded because these hooks only run on the client side.

### Features
* Authentication, both email/password and Google OAuth via Firebase
* Authorization with Stripe subscriptions
* Database storage of users' libraries in Firestore
* Complex loading states
* Audio player
* Responsive design
