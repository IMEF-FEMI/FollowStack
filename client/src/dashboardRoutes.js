// Layout Types
import { DefaultLayout } from "./views/dashboard/layouts";
// Route Views
import Tweets from "./views/dashboard/mainAppPages/pages/viewTweets/Main";
import Profile from "./views/dashboard/mainAppPages/pages/userProfile/Main";
import UsersOnline from "./views/dashboard/mainAppPages/pages/usersOnline/Main";
import EarnPoints from "./views/dashboard/mainAppPages/pages/earnPoints/Main";
import BuyPoints from "./views/dashboard/mainAppPages/pages/earnPoints/BuyPoints";

export default [
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
  },
  {
    path: "/earn-points",
    layout: DefaultLayout,
    component: EarnPoints
  },{
    path: "/buy-points",
    layout: DefaultLayout,
    component: BuyPoints
  }
];
