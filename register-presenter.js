/**
 * Register Presenter
 * Connects RegisterPage view with AuthModel data
 */
class RegisterPresenter {
  /**
   * Constructor
   * @param {object} view - RegisterPage instance
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
    this.view.bindRegister(this.register.bind(this));
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
      this.view.setLoading(true);
      
      // Validate inputs
      if (!name.trim()) {
        throw new Error('Please enter your name');
      }
      
      if (!email.trim()) {
        throw new Error('Please enter your email address');
      }
      
      if (!password) {
        throw new Error('Please enter your password');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      
      // Send registration request
      const response = await this.model.register({
        name,
        email,
        password,
      });
      
      this.view.showSuccess('Registration successful! Please log in.');
      
      return response;
    } catch (error) {
      this.view.showError(error.message);
      throw error;
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default RegisterPresenter;
