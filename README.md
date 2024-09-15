# Live Devs 💻

**Live Devs** is a collaborative platform designed for developers to pair program in real-time. Users can create or join coding rooms and collaborate via code sharing and chat, making it easier to build projects with others from anywhere in the world.

🔗 **Live Demo**: [Live Devs](https://livedevs.vercel.app)

---

## 🚀 Features

- 👥 **Real-time Collaboration**: Join or create coding rooms and collaborate with others.
- 📝 **Shared Code Editor**: Write, edit, and execute code in real-time with other developers.
- 💬 **Chat Support**: Built-in chat for seamless communication while coding.
- 🔐 **User Authentication**: Secure login system with session management.
- 🌐 **PostgreSQL and Drizzle ORM**: Efficient data handling with a strong backend setup.
- 📡 **Stream Chat Integration**: Real-time chat and message streaming within each coding room.

---

## 🛠️ Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Drizzle ORM, PostgreSQL
- **Authentication**: NextAuth.js
- **Real-time Communication**: Stream Chat API
- **Deployment**: Vercel

---

## ⚙️ Installation and Setup

Follow these steps to get a local copy of Live Devs up and running.

1. **Clone the repository:**

    ```bash
    git clone https://github.com/unhiredcoder/livedevs.git
    cd livedevs
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up the environment variables:**

    Create a `.env` file in the root directory and add the following:

    ```bash
    NEXT_PUBLIC_APP_URL=http://your-app-url
    NEXTAUTH_URL=http://your-auth-url
    NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
    DATABASE_URL=postgresql://your-db-username:your-db-password@your-db-host:5432/your-db-name
    GET_STREAM_SECRET_KEY=your-get-stream-secret-key
    GOOGLE_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
    ```

4. **Run the app locally:**

    ```bash
    npm run dev
    ```

    The app will be running on `http://localhost:3000`.

 ---
   
## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
