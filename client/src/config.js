export const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "http://followstack.com"
    : "http://localhost:8080";
