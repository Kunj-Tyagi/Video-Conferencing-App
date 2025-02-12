let IS_PROD = true;

const server = IS_PROD
  ? "https://video-conferencing-app-1-q1v3.onrender.com"
  : "http://localhost:8000";

export default server;
