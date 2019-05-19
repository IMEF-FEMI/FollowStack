export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://react-auth-twitter.herokuapp.com"
    : "https://localhost:8080";
export const firebaseKeys = [{
  apiKey: " AIzaSyDPRnO_g0nrFa0PNI7IynwTdCnRg8nWNJc",
  authDomain: "followstack.firebaseapp.com",
  projectId: "followstack"
},
{
  apiKey: " AIzaSyCNaEDihcbJb5l1GMOW3PlqgDqFuYeFvB0",
  authDomain: "followstack-app.firebaseapp.com",
  projectId: "followstack-app"
},
{
  apiKey: " AIzaSyCtFO9K3pzqzhz7hpbn6UwRmpSViSKJGT0",
  authDomain: "follow-stack.firebaseapp.com",
  projectId: "follow-stack"
},
{
  apiKey: " AIzaSyBvVo4j97NhxPu0tPnm1FsMwuS6wskG0cY",
  authDomain: "follow-stack-app.firebaseapp.com",
  projectId: "follow-stack-app"
}]