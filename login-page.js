import { applyTransitionClass } from '../../utils/view-transitions';
import LoginForm from '../components/login-form';
import AuthModel from '../../models/auth-model';

class LoginPage {
  constructor() {
    this.authModel = new AuthModel();
  }

  getTemplate() {
    applyTransitionClass('login');
    
    return `
      <section class="content">
        <h2 class="text-center">Login to Dicoding Story</h2>
        
        <div class="form-container">
          ${LoginForm()}
        </div>
      </section>
    `;
  }

  async afterRender() {
    this._initEventListeners();
  }

  _initEventListeners() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('loginButton');
    const alertContainer = document.getElementById('alertContainer');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      // Validate inputs
      if (!emailInput.value.trim()) {
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            Please enter your email address.
          </div>
        `;
        return;
      }
      
      if (!passwordInput.value) {
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            Please enter your password.
          </div>
        `;
        return;
      }
      
      // Disable form during submission
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      
      try {
        const response = await this.authModel.login({
          email: emailInput.value,
          password: passwordInput.value,
        });
        
        // Update UI based on auth status
        window.dispatchEvent(new Event('auth-changed'));
        
        // Show success message
        alertContainer.innerHTML = `
          <div class="alert alert-success">
            Login successful! Redirecting...
          </div>
        `;
        
        // Redirect to home after short delay
        setTimeout(() => {
          window.location.hash = '#/';
          location.reload(); // Refresh to update auth UI
        }, 1000);
      } catch (error) {
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            ${error.message}
          </div>
        `;
        
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
      }
    });
  }
}

export default LoginPage;
