/**
 * Login Presenter
 * Connects LoginPage view with AuthModel data
 */
class LoginPresenter {
  /**
   * Constructor
   * @param {object} view - LoginPage instance
   * @param {object} model - AuthModel instance
   */
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  /**
   * Initialize presenter
   */
  init() {
    this.view.bindLogin(this.login.bind(this));
  }

  /**
   * Log in with credentials
   * @param {object} credentials - Login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise<object>} Login response
   */
  async login({ email, password }) {
    try {
      this.view.setLoading(true);
      
      // Validate inputs
      if (!email.trim()) {
        throw new Error('Please enter your email address');
      }
      
      if (!password) {
        throw new Error('Please enter your password');
      }
      
      // Send login request
      const response = await this.model.login({
        email,
        password,
      });
      
      this.view.showSuccess('Login successful!');
      
      return response;
    } catch (error) {
      this.view.showError(error.message);
      throw error;
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default LoginPresenter;
