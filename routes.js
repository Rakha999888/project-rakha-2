import HomePage from '../views/pages/home-page';
import DetailPage from '../views/pages/detail-page';
import AddStoryPage from '../views/pages/add-story-page';
import LoginPage from '../views/pages/login-page';
import RegisterPage from '../views/pages/register-page';

const routes = [
  {
    url: '/',
    page: HomePage,
    auth: false,
  },
  {
    url: {
      resource: 'detail',
      id: ':id',
      verb: null,
    },
    page: DetailPage,
    auth: false,
  },
  {
    url: 'add',
    page: AddStoryPage,
    auth: true, // Require authentication
  },
  {
    url: 'login',
    page: LoginPage,
    auth: false,
  },
  {
    url: 'register',
    page: RegisterPage,
    auth: false,
  },
];

export default routes;