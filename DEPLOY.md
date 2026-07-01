# Deployment Guide: Valentine App

This guide covers deploying the **Frontend to Netlify** and the **Backend to Render** with **MongoDB Atlas**.

## Part 1: Detailed Backend Deployment (Render + MongoDB)

### Step 1: Set up MongoDB Atlas (Database)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login.
2.  Create a **New Project**.
3.  Click **Create a Cluster** (Select the **FREE** tier, usually M0 Sandbox).
4.  **Security Setup**:
    - **Database Access**: Create a database user (e.g., `admin`) and password. **Remember this password!**
    - **Network Access**: Click "Add IP Address" -> **"Allow Access from Anywhere"** (`0.0.0.0/0`). This is required for Render to connect.
5.  **Get Connection String**:
    - Click **Connect** -> **Drivers** (Node.js).
    - Copy the string. It looks like:
      `mongodb+srv://admin:<password>@cluster0.axxb.mongodb.net/?retryWrites=true&w=majority`
    - Replace `<password>` with your actual password.

### Step 2: Deploy Backend to Render
1.  Push your latest code to GitHub/GitLab.
2.  Go to [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Blueprints**.
4.  Connect your repository.
5.  Render will detect `render.yaml`. Click **Apply**.
6.  **Fill in Environment Variables**:
    - `MONGO_URI`: Paste your connection string from Step 1.
    - `FRONTEND_URL`: Paste your **Netlify URL** (e.g., `https://neon-parfait-396917.netlify.app`).
7.  Click **Apply Changes**.
8.  Wait for deployment. Once done, copy your **Service URL** (e.g., `https://valentine-api.onrender.com`).

---

## Part 2: Connect Frontend (Netlify)

Now that your backend is live, tell your frontend where to find it.

1.  Go to your **Netlify Dashboard**.
2.  Select your site > **Site configuration** > **Environment variables**.
3.  Add a generic variable:
    - **Key**: `VITE_API_URL`
    - **Value**: Your **Render Backend URL** (e.g., `https://valentine-api.onrender.com`) - note: **remove any trailing slash `/`**.
4.  **Re-deploy the Frontend**:
    - Go to **Deploys** tab > **Trigger deploy** > **Deploy site**.
    - Or simply push a small change to GitHub to trigger a build.

---

## Verification
1.  Open your Netlify site.
2.  Go through the "Create" flow.
3.  If it works without "Network Error", you are done!
