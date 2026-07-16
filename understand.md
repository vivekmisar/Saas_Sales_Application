# 🗺️ Codebase Navigation Guide: From Zero to Hero

Welcome! If you know the basics of Node, Express, and JavaScript, you're exactly in the right place to understand this repository. This document will serve as your personal compass.

Instead of jumping into random files, we'll follow a **logical flow**. We will start from the very foundation (where the app boots up) and trace how a request is handled. We'll do this first for the Backend, and then for the Frontend.

> [!TIP]
> **Golden Rule of Reading Codebases:** Don't try to read every single line of every file. Focus on the *flow*. Look at how files connect to each other. Once you understand the structure, you can dive deep into specific functions later when you need to change them.

---

## 🏗️ 1. The Big Picture: Our Tech Stack
Before we dive into the code, here is what powers this project:
*   **Backend (`/server`)**: Node.js, Express, MongoDB (via Mongoose). We use Passport.js for authentication and Joi for data validation.
*   **Frontend (`/client`)**: React (built with Vite). We use React Router for navigation, React Query for API fetching, TailwindCSS for styling, and Context API for global state.

---

## 🔌 2. Backend Flow: How the Server Thinks

The backend is located in the `/server` folder. Open this folder and follow these steps in order:

### Step 1: The Blueprint
*   **Read [server/package.json](file:///d:/Major%20Project/server/package.json)**
    *   *Why?* It lists all our dependencies (libraries we use) and scripts (like `"start"` and `"dev"`). You'll see we use `express`, `mongoose`, `passport`, etc.

### Step 2: The Engine Starter
*   **Read [server/server.js](file:///d:/Major%20Project/server/server.js)**
    *   *Why?* This is the entry point. It literally boots the server.
    *   *What to look for:* Notice how it connects to MongoDB first (`connectDB`), and then imports `app` to start listening on a port. It also handles critical crashes.

### Step 3: The Express Factory
*   **Read [server/src/app.js](file:///d:/Major%20Project/server/src/app.js)**
    *   *Why?* This is where Express is configured. 
    *   *What to look for:* See the middlewares? `helmet` (security), `cors` (allowing frontend requests), `express.json` (parsing JSON data), and `passport` (auth sessions). At the bottom, you'll see how all routes are plugged in (`app.use('/api/v1', routes)`).

### Step 4: The Traffic Cop (Routes)
*   **Read [server/src/routes/index.js](file:///d:/Major%20Project/server/src/routes/index.js)**
    *   *Why?* It groups all our different API endpoints.
    *   *What to look for:* You'll see routes split by feature: `/auth`, `/users`, `/projects`.
*   **Action:** Pick one route file, like **`server/src/routes/auth.routes.js`**, and open it. You'll see specific endpoints (like `POST /login`) pointing to functions in the Controller.

### Step 5: The Brains (Controllers & Services)
When a request hits a route, it goes to a Controller.
*   **Explore `server/src/controllers/`**
    *   *Why?* Controllers handle the HTTP request (`req`) and response (`res`). They extract data from the request and send the final response back to the user.
*   **Explore `server/src/services/`**
    *   *Why?* Services hold the heavy business logic. Controllers shouldn't be too long; they should ask the Service to do the hard work (like talking to the database).

### Step 6: The Database Blueprint (Models)
*   **Explore `server/src/models/`**
    *   *Why?* These are Mongoose schemas. They define the exact shape of our data (Users, Projects, etc.) inside MongoDB.

> [!NOTE]
> **Summary of Backend Request Flow:**
> Route (URL) -> Validation Middleware -> Controller (req, res) -> Service (Business Logic) -> Model (Database)

---

## 💻 3. Frontend Flow: How the User Interface Works

The frontend is located in the `/client` folder. It's a modern React application. Let's trace it from boot to UI.

### Step 1: The Blueprint
*   **Read [client/package.json](file:///d:/Major%20Project/client/package.json)**
    *   *Why?* Check the dependencies. You'll spot React, Tailwind, React Router, React Query, and Axios.

### Step 2: Where React Mounts
*   **Read [client/src/main.jsx](file:///d:/Major%20Project/client/src/main.jsx)**
    *   *Why?* This is the absolute starting point for React. It grabs the HTML element with id `root` and renders the `<App />` inside it. It also imports global CSS (`index.css`).

### Step 3: The App Wrappers
*   **Read [client/src/App.jsx](file:///d:/Major%20Project/client/src/App.jsx)**
    *   *Why?* This file wraps your app with essential "Providers". 
    *   *What to look for:* Notice `<QueryClientProvider>` (for API fetching), `<ThemeProvider>`, and `<AuthProvider>` (global states). Then it renders `<AppRouter />`.

### Step 4: Navigation (React Router)
*   **Read [client/src/router/AppRouter.jsx](file:///d:/Major%20Project/client/src/router/AppRouter.jsx)**
    *   *Why?* This tells React which UI to show based on the URL. 
    *   *What to look for:* Look at how URLs map to Pages (e.g., `/login` shows the Login page). Look out for **`ProtectedRoute.jsx`**, which checks if a user is logged in before letting them see private pages.

### Step 5: The UI (Pages & Components)
*   **Explore `client/src/pages/`**
    *   These are the big, full-screen views (like Dashboard, Login, Profile).
*   **Explore `client/src/components/`**
    *   These are smaller, reusable pieces (like Buttons, Modals, Navbars). 

### Step 6: Talking to the Server (API & Hooks)
When a user clicks a button, we need to fetch data from our Backend.
*   **Explore `client/src/api/`**
    *   This folder usually holds Axios setups and raw API calls to our backend endpoints (`/api/v1/...`).
*   **Explore `client/src/hooks/`**
    *   Here you'll find custom React Hooks (like `useAuth.js`). These hooks often use React Query (`useQuery` / `useMutation`) to run the API calls and handle loading/error states cleanly for the UI.

---

## 🎯 4. Your First Task: Tracing a Feature End-to-End

To test your understanding, try tracing a single feature. Let's take "User Login" as an example:

1.  **Frontend UI**: Find the login form in `client/src/pages`. 
2.  **Frontend API**: See what function gets called when you click "Submit" (check `client/src/hooks` or `client/src/api`).
3.  **Backend Route**: Find the matching URL in `server/src/routes/auth.routes.js`.
4.  **Backend Controller & Service**: Follow the route into the `auth.controller` and then the `auth.service` to see how the password is checked.
5.  **Database**: Look at the `User` model in `server/src/models` to see what a user looks like.

> [!IMPORTANT]
> If you get stuck or feel overwhelmed, take a break! A codebase is like a new city. You won't learn all the streets in one day. Focus on finding the main highways first (the files listed above), and slowly explore the side streets (utils, helpers, middlewares) later. Happy coding!
