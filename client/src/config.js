export const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "https://followstack.herokuapp.com"
    : "https://localhost:8080";
