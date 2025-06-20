# **App Name**: Stickitty.inc

## Core Features:

- Animated Landing Page: Animated landing page with a Stickitty black cat avatar and modern, scroll-driven transitions.
- Sticker Generator: Users input prompts, sent to local LLM or cloud endpoint. Image returns to editor where users can resize, drag, add effects, and text. The AI model acts as a tool that determines the visual output based on mood, style and characters selected by the user.
- AI Companion (Stickitty Cat): Animated assistant (Stickitty Cat) that floats on-screen, uses AI to chat, guide, suggest stickers, with optional speech input.
- Visual Search and Filtering: Visual search allowing users to find stickers by vibe/aesthetic tag using Firebase ML image label search or a custom model. The AI model acts as a tool to determine the appropriate sticker for the user's prompt.
- User Accounts + Profiles: Firebase Auth (email, Google, optional wallet login) for saving custom stickers, purchases, and prompts. Profile stats: Favorites, Orders, Recommended Vibes.
- E-Commerce Backend: Stripe payments and Firebase Firestore for storing products, user data, and orders. Cloud Functions to handle generation jobs and order fulfillment.
- Admin Dashboard: Admin dashboard to upload new templates/sticker assets, monitor orders/trends/feedback, and trigger AI drops/updates/newsletter posts.
- Web3 Ready: Optional wallet connection using WalletConnect, allowing mintable NFTs from user-generated stickers in future phases.

## Style Guidelines:

- Inspired by Azuki.com: clean and dynamic design.
- Matte black background, electric gold/yellow highlights, sticker bursts.
- Sharp display font + minimal clean sans-serif.
- Modern, scroll-driven transitions with a rebellious, animated mascot (Stickitty).