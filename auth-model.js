/**
 * Auth Model - handles authentication operations
 */
class AuthModel {
  constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @returns {Promise<object>} Registration response
   */
  async register({ name, email, password }) {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const responseJson = await response.json();
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Login a user
   * @param {object} credentials - Login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise<object>} Login response with user data and token
   */
  async login({ email, password }) {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const responseJson = await response.json();
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      // Save auth data to local storage
      localStorage.setItem('auth', JSON.stringify(responseJson.loginResult));

      return responseJson;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const auth = this.getAuthData();
    return !!auth.token;
  }

  /**
   * Get authentication data from local storage
   * @returns {object} Auth data including token, userId, and name
   */
  getAuthData() {
    return JSON.parse(localStorage.getItem('auth') || '{}');
  }

  /**
   * Logout - clear auth data from local storage
   */
  logout() {
    localStorage.removeItem('auth');
  }
}

export default AuthModel;
