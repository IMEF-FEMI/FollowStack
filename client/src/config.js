export const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "https://followstack.herokuapp.com"
    : "http://localhost:8080";
