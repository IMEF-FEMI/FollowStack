// Layout Types
import { DefaultLayout } from "./views/dashboard/layouts";
// Route Views
import DashBoard from "./views/dashboard/DashBoard";
import Main from "./views/dashboard/mainAppPages/pages/gainFollowers/Main";
import Profile from "./views/dashboard/mainAppPages/pages/userProfile/Main";

export default [
  {
    path: "/dashboard",
    layout: DefaultLayout,
    component: DashBoard
  },
  {
    path: "/gain-followers",
    layout: DefaultLayout,
    component: Main
  },
  {
    path: "/user",
    layout: DefaultLayout,
    component: Profile
  }
];
