import DrawerInitiator from '../utils/drawer-initiator';
import UrlParser from '../routes/url-parser';
import { transitionHelper } from '../utils/view-transitions';
import AuthModel from '../models/auth-model';

/**
 * App - Main application class
 */
class App {
  constructor({ content, routes }) {
    this.content = content;
    this.routes = routes;
    this.authModel = new AuthModel();

    // Initialize the drawer
    this._initializeDrawer();
    
    // Update auth UI on load
    this.updateAuthUI();
  }

  /**
   * Initialize the mobile navigation drawer
   * @private
   */
  _initializeDrawer() {
    const drawer = {
      button: document.querySelector('#hamburgerButton'),
      drawer: document.querySelector('#navigationDrawer'),
      content: document.querySelector('#mainContent'),
    };

    DrawerInitiator.init(drawer);
  }

  /**
   * Update the UI based on authentication status
   */
  updateAuthUI() {
    const isAuthenticated = this.authModel.isAuthenticated();
    const loginMenuItem = document.querySelector('#loginMenuItem');
    const registerMenuItem = document.querySelector('#registerMenuItem');
    const logoutMenuItem = document.querySelector('#logoutMenuItem');

    if (isAuthenticated) {
      loginMenuItem.classList.add('hidden');
      registerMenuItem.classList.add('hidden');
      logoutMenuItem.classList.remove('hidden');
    } else {
      loginMenuItem.classList.remove('hidden');
      registerMenuItem.classList.remove('hidden');
      logoutMenuItem.classList.add('hidden');
    }
  }

  /**
   * Render the current page based on URL
   */
  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    let page = null;

    // Find the matching route, or fallback to the first route (home)
    const route = this.routes.find((route) => {
      const routeUrl = typeof route.url === 'string' 
        ? { resource: route.url, id: null, verb: null } 
        : route.url;
      
      return routeUrl.resource === url.resource && 
             routeUrl.id === url.id && 
             routeUrl.verb === url.verb;
    }) || this.routes[0];

    // Check for protected routes
    if (route.auth && !this.authModel.isAuthenticated()) {
      // Redirect to login
      window.location.hash = '#/login';
      return;
    }

    try {
      // Create the page instance
      page = new route.page();

      // Use view transition to smoothly change the content
      await transitionHelper(() => {
        this.content.innerHTML = page.getTemplate();
      });

      // Initialize the page after content is rendered
      await page.afterRender();
    } catch (error) {
      console.error('Failed to render page:', error);
      this.content.innerHTML = `<div class="error-container">
        <h2>Something went wrong</h2>
        <p>${error.message}</p>
        <a href="#/">Go to Home</a>
      </div>`;
    }
  }
}

export default App;
