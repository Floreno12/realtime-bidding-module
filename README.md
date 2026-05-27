# Real-Time Bidding Module (Vintage Watch Auction)

A full-stack, real-time bidding application built with **Next.js (App Router)** on the frontend and **NestJS + Prisma + PostgreSQL** on the backend. This application ensures ultra-low latency updates across multiple clients while maintaining absolute data integrity under high-concurrency race conditions.

### Project Links

- **Live Demo Link:** [https://realtime-bidding-module-prod.vercel.app/](https://realtime-bidding-module-prod.vercel.app/)

---

# Deployment & Infrastructure

The application is fully deployed using split cloud environments for optimal performance:

- **Frontend:** Hosted on **Vercel** for fast global asset delivery and optimized edge routing.
- **Backend API:** Hosted on **Render**, containerizing the NestJS engine while maintaining persistent WebSocket connections.
- **Database:** Powered by a serverless **Neon PostgreSQL** cloud instance.

---

## Tech Stack & Library Rationales

### Frontend

- **Next.js (App Router):** Chosen for optimized client-side hydration, structured layout management, and native performance characteristics.
- **Socket.io-client:** Leveraged to maintain a bidirectional, persistent WebSocket connection with the backend gateway, heavily outperforming standard HTTP polling.
- **Tailwind CSS:** Used to construct a responsive, highly polished desktop/mobile bidding interface without introducing heavy third-party UI library bloat.

### Backend

- **NestJS:** Selected for its strict architectural patterns, native dependency injection, and clean out-of-the-box WebSocket gateway architecture.
- **Prisma ORM:** Utilized for type-safe database queries, automated structural migrations, and reliable transaction management.
- **Socket.io:** Paired with NestJS WebSockets to handle room-wide broadcasting and isolated, client-specific event emissions.

---

## Real-Time Architecture Details

Rather than relying on resource-heavy HTTP polling loops, this application establishes a long-lived WebSocket pipe via Socket.io immediately upon client mounting.

1. **Immediate State Hydration:** When a user opens a new browser window, the NestJS `OnGatewayConnection` life cycle hook intercepts the client context and emits an immediate `auctionStatus` payload. This delivers the current highest price and recent bid history trail instantly, ensuring the UI is never stale on initial load.
2. **Global Event Broadcasts:** When a user submits a valid bid, the gateway validates it against database bounds and uses `this.server.emit('auctionUpdated', ...)` to globally broadcast the newly updated state to all connected socket instances within milliseconds.

---

## ️Concurrency & Edge Case Handling (Simultaneous Bidding)

A critical milestone of this architecture is answering the question: **What happens if 2 users place a bid at the exact same millisecond?**

If the backend reads the database price and writes a new row blindly, a race condition occurs where both users can succeed on an outdated price, breaking the strict bid rules.

### Solution: Serializable Isolation Level & Automatic Retries

The backend wraps the validation and insertion actions within a sequential database transaction utilizing a **`Serializable` isolation level**.

- **The Database Lock:** If User A and User B execute transactions simultaneously, the database isolates their threads. User A's bid goes through first. The database detects that User B read a price value that has now changed, and safely aborts User B’s transaction by throwing a serialization conflict exception (`P2034` / deadlock check).

---

# How to Run the Project Locally

## Prerequisites

Before starting, ensure you have:

- Node.js
- A running PostgreSQL database instance

---

# Backend Setup

Navigate into the backend project directory:

```bash
cd backend
```

## Create Environment Variables

Create a `.env` file inside the `/backend` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/bidding_db?schema=public"
PORT=3001
```

## Install Dependencies & Start Backend

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

The NestJS server and WebSocket gateway will now run locally at:

```txt
http://localhost:3001
```

---

# Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```bash
cd ../frontend
```

## Install Dependencies & Start Frontend

```bash
npm install
npm run dev
```

The Next.js frontend will now run locally at:

```txt
http://localhost:3000
```
