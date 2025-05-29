import 'regenerator-runtime';
import './styles/main.css';
import './styles/components.css';
import './styles/transitions.css';
import './utils/view-transitions';
import App from './views/app';
import routes from './routes/routes';

const app = new App({
    content: document.querySelector('#mainContent'),
    routes: routes,
});

window.addEventListener('hashchange', () => {
    app.renderPage();
});

window.addEventListener('load', () => {
    app.renderPage();
});

// Handle logout button click
const logoutButton = document.querySelector('#logoutButton');
logoutButton.addEventListener('click', (event) => {
  event.preventDefault();
  // Clear local storage
  localStorage.removeItem('auth');
  // Update UI
  app.updateAuthUI();
  // Redirect to home
  window.location.hash = '#/';
});