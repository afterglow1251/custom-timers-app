# `Custom Timers App` ⏱️

**Frontend**: Ionic + Angular  
**Backend**: Koa + TypeScript + Sequelize + PostgreSQL

## Installation and launch ⚙️

## Clone the repository

```bash
git clone https://github.com/afterglow1251/custom-timers-app.git
cd custom-timers-app
```

### Backend

1. Go to the backend directory and install the dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a .env file in the backend root and fill it in (example):

   ```env
   NODE_ENV=development
   PORT=3000

   DB_NAME=your_database_name
   DB_USERNAME=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   DB_PORT=5432

   FRONTEND_URL=http://localhost:8100

   ACCESS_SECRET=your_access_secret_key
   REFRESH_SECRET=your_refresh_secret_key

   ACCESS_TOKEN_EXPIRATION=1d
   REFRESH_TOKEN_EXPIRATION=7d
   ```

   ⚠️ Fill in the values according to your environment setup.

3. Run the backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Go to the frontend directory and install the dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Run the frontend:
   ```bash
   ionic serve
   ```
