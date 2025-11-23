# Deployment Guide

Since this is a full-stack application with a Node.js backend and MongoDB database, you have a few options for free hosting.

## Option 1: Vercel (Recommended for ease of use)

Vercel is great for frontend and can handle simple Node.js serverless functions. I have added a `vercel.json` file to configure this project for Vercel.

### Steps:
1.  **Push to GitHub**:
    - Create a new repository on GitHub.
    - Push this project code to the repository.
2.  **Connect to Vercel**:
    - Go to [vercel.com](https://vercel.com) and sign up/login.
    - Click "Add New" > "Project".
    - Import your GitHub repository.
3.  **Environment Variables**:
    - In the Vercel project settings, go to "Environment Variables".
    - Add `MONGODB_URI` with your MongoDB Atlas connection string (see Database section below).
4.  **Deploy**:
    - Click "Deploy". Vercel will build and deploy your site.
    - You will get a URL like `https://your-project.vercel.app`.

## Option 2: Render (Good for full server control)

Render offers a free tier for Node.js web services.

### Steps:
1.  **Push to GitHub**.
2.  **Create Web Service on Render**:
    - Go to [render.com](https://render.com).
    - Create a new "Web Service".
    - Connect your GitHub repo.
    - Build Command: `npm install`
    - Start Command: `npm start`
3.  **Environment Variables**:
    - Add `MONGODB_URI` in the Environment settings.

## Database (MongoDB Atlas)

For the backend to work on the cloud, you need a cloud database. You cannot use `localhost` in production.

1.  Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2.  Create a free cluster.
3.  Create a database user and allow network access (0.0.0.0/0).
4.  Get the Connection String (URI). It looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio_db`.
5.  Use this URI in your Vercel or Render environment variables.

## Important Note
I cannot perform these steps for you as they require logging into your personal accounts (GitHub, Vercel, MongoDB). Please follow the steps above to get your site live!
