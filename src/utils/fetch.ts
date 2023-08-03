import axios from "axios";

const http = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://d3-site-server.onrender.com"
      : "http://localhost:3000",
});

export { http };
