# ZTOH - Web Application

A modern, responsive web application for ZTOH (Zero to One Hundred), featuring a dynamic frontend and a robust admin dashboard for managing requests and administrators.

## 🚀 Features

### Frontend
*   **Modern UI/UX**: Built with React, Tailwind CSS, and Framer Motion for smooth animations.
*   **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
*   **Dynamic Components**:
    *   **Infinite Carousel**: "Our Services" section features a smooth, infinite scrolling carousel.
    *   **Interactive Modals**: "Join Us" and "Service Details" modals with custom dropdowns and animations.
    *   **Smooth Navigation**: Sticky navbar with smooth scrolling to sections.

### Admin Panel
*   **Secure Authentication**: JWT-based authentication with HTTP-only cookies and middleware protection.
*   **Dashboard Overview**: Real-time overview of Join and Contact requests.
*   **Request Management**:
    *   View detailed information for each request.
    *   Filter requests by type (Student/Teacher) and search by name/email.
    *   Delete requests with confirmation.
*   **Admin Management**:
    *   List all administrators.
    *   Add new admins.
    *   Edit admin details and passwords.
    *   Delete admins.
*   **Security**:
    *   Protected routes (`/admin`, `/api/admin/*`).
    *   Secure password handling.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
*   **Authentication**: [Jose](https://github.com/panva/jose) (JWT)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas connection string)

## ⚙️ Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Kavinnandha/ztoh.git
    cd ztoh
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET_KEY=your_secure_random_secret_key
    NODE_ENV=development
    ```

4.  **Seed the Database**:
    Initialize the database with a default admin user.
    ```bash
    npx tsx scripts/seed-admin.ts
    ```
    *   **Default Credentials**:
        *   Email: `admin@ztoh.org`
        *   Password: `admin123`

## 🚀 Local Deployment

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
*   **Main Site**: `http://localhost:3000`
*   **Admin Login**: `http://localhost:3000/admin/login`

## ☁️ Cloud Deployment (Vercel)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1.  **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2.  **Import to Vercel**:
    *   Go to Vercel Dashboard and click "Add New Project".
    *   Import your GitHub repository.
3.  **Configure Environment Variables**:
    *   Add `MONGODB_URI` and `JWT_SECRET_KEY` in the Vercel project settings.
4.  **Deploy**: Click "Deploy". Vercel will build and deploy your application.

## 📂 Project Structure

```
ztoh/
├── public/              # Static assets (images, icons)
├── scripts/             # Utility scripts (seeding)
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── admin/       # Admin pages (Dashboard, Login)
│   │   ├── api/         # API Routes
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Landing page
│   ├── components/      # Reusable components
│   │   ├── sections/    # Landing page sections
│   │   └── ui/          # UI components (Buttons, Inputs)
│   ├── lib/             # Utilities (DB connection, Auth)
│   └── models/          # Mongoose models (Admin, Request)
├── .env                 # Environment variables
├── middleware.ts        # Auth middleware
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## 🔐 Security Notes

*   **JWT Secret**: Ensure `JWT_SECRET_KEY` is a long, random string in production.
*   **Cookies**: The application uses HTTP-only cookies for security. Ensure your production domain supports HTTPS.
*   **Middleware**: The `middleware.ts` file ensures that all `/admin` routes are protected and require a valid token.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
