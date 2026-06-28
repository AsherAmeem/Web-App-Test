const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'Web App Test',
    description: 'A test application for practising deployment with Docker, GitLab CI, Vercel, IIS, and FileZilla',
    deploymentMethods: [
      { name: 'Docker', icon: '🐳', description: 'Containerised deployment using Docker & Docker Compose' },
      { name: 'GitLab CI/CD', icon: '🦊', description: 'Automated pipeline deployment via GitLab CI' },
      { name: 'Vercel', icon: '▲', description: 'Serverless deployment on the Vercel platform' },
      { name: 'IIS', icon: '🪟', description: 'Windows IIS web server deployment' },
      { name: 'FileZilla', icon: '📁', description: 'Manual FTP/SFTP file transfer deployment' },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
