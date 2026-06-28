# Web App Test

A React + Node.js/Express application for practising deployment using multiple methods.

## Project Structure

```
Web-App-Test/
├── backend/          # Node.js Express API (port 5000)
│   ├── src/index.js
│   ├── Dockerfile
│   └── package.json
├── frontend/         # React app (port 3000 in dev)
│   ├── src/
│   ├── public/
│   │   └── web.config   # IIS config
│   ├── nginx.conf        # Nginx config for Docker
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .gitlab-ci.yml
├── vercel.json
└── README.md
```

## Local Development

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm start
```

Visit http://localhost:3000. API calls are proxied to http://localhost:5000.

---

## Deployment Methods

### 1. Docker / Docker Compose

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

### 2. GitLab CI/CD

1. Push the repo to GitLab.
2. The `.gitlab-ci.yml` pipeline runs install → build → test automatically on every push.
3. The `docker:build-push` job is manual and requires `DOCKER_HUB_USER` and `DOCKER_HUB_TOKEN` set in GitLab → Settings → CI/CD → Variables.

### 3. Vercel

1. Import the repo into Vercel.
2. `vercel.json` routes `/api/*` to the Node backend and everything else to the React build.
3. Set `REACT_APP_API_URL` to your Vercel deployment URL if the backend is hosted separately.

### 4. IIS (Windows)

**Frontend (static files):**
1. `cd frontend && npm run build`
2. Copy the contents of `frontend/build/` to your IIS site root.
3. `web.config` is already included in the build — it handles React routing and proxies `/api/*` to the Node backend.
4. Enable the **URL Rewrite** and **Application Request Routing** IIS modules.

**Backend (Node.js service):**
1. Install [nssm](https://nssm.cc/) or use pm2-windows-service.
2. Register the backend: `nssm install WebAppBackend node C:\path\to\backend\src\index.js`
3. Ensure it listens on port 5000.

### 5. FileZilla (FTP/SFTP)

1. `cd frontend && npm run build`
2. Open FileZilla and connect to your server (SFTP, port 22 recommended).
3. Upload the contents of `frontend/build/` to your web root (e.g. `/var/www/html`).
4. Upload the `backend/` folder to your server and run `npm ci --omit=dev && node src/index.js` via SSH.
5. Configure Nginx/Apache on the server to proxy `/api/*` to `localhost:5000`.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check — returns status, timestamp, environment |
| GET | `/api/info` | App info and list of deployment methods |
