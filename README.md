# TuneFriends - Premium Scrollytelling & Social Music Platform

TuneFriends is a real-time social music experience where friends can listen together in perfect sync.

## 🚀 Getting Started

### Frontend (User Interface)

1.  **Navigate to project root:**
    ```bash
    cd "c:\Users\Atul\Desktop\antigravity tunefreids"
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    View at [http://localhost:3000](http://localhost:3000)

### Backend (API & Real-time Server)

1.  **Navigate to backend directory:**
    ```bash
    cd backend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment:**
    Ensure you have MongoDB running locally. The default connection is `mongodb://localhost:27017/tunefreids`.
    Check `.env` for configuration.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The server runs on port **5001**.

## 🛠 Tech Stack

-   **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
-   **Backend**: Node.js, Express, Socket.IO, MongoDB, TypeScript

## 📡 API Endpoints

-   `POST /api/rooms/create` - Create a new room
-   `GET /api/search?q=query` - Search for songs (iTunes API)

## 🔄 Real-Time Events (Socket.IO)

-   `room:join` - Join a room
-   `song:change` - Host changes song
-   `song:sync` - Sync playback state
