// Layout Types
import { DefaultLayout } from "./views/dashboard/layouts";
// Route Views
import DashBoard from "./views/dashboard/DashBoard";
import Tweets from "./views/dashboard/mainAppPages/pages/viewTweets/Main";
import Profile from "./views/dashboard/mainAppPages/pages/userProfile/Main";
import UsersOnline from "./views/dashboard/mainAppPages/pages/usersOnline/Main";

export default [
  {
    path: "/dashboard",
    layout: DefaultLayout,
    component: DashBoard
  },
  {
    path: "/gain-followers",
    layout: DefaultLayout,
    component: UsersOnline
  },
  {
    path: "/shared-tweets",
    layout: DefaultLayout,
    component: Tweets
  },
  {
    path: "/profile",
    layout: DefaultLayout,
    component: Profile
  }
];
