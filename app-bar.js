import AuthModel from '../../models/auth-model';

/**
 * Generate AppBar component
 * @param {boolean} isAuthenticated - Authentication status
 * @returns {string} HTML string
 */
const AppBar = (isAuthenticated) => {
  return `
    <div class="app-bar__menu">
      <button id="hamburgerButton">☰</button>
    </div>
    <div class="app-bar__brand">
      <h1>Dicoding Story</h1>
    </div>
    <nav id="navigationDrawer" class="app-bar__navigation">
      <ul>
        <li><a href="#/">Home</a></li>
        <li><a href="#/add">Add Story</a></li>
        ${isAuthenticated 
          ? `<li><a href="#" id="logoutButton">Logout</a></li>` 
          : `
            <li><a href="#/login">Login</a></li>
            <li><a href="#/register">Register</a></li>
          `
        }
      </ul>
    </nav>
  `;
};

export default AppBar;
