import { applyTransitionClass } from '../../utils/view-transitions';
import RegisterForm from '../components/register-form';
import AuthModel from '../../models/auth-model';

class RegisterPage {
  constructor() {
    this.authModel = new AuthModel();
  }

  getTemplate() {
    applyTransitionClass('register');
    
    return `
      <section class="content">
        <h2 class="text-center">Register to Dicoding Story</h2>
        
        <div class="form-container">
          ${RegisterForm()}
        </div>
      </section>
    `;
  }

  async afterRender() {
    this._initEventListeners();
  }

  _initEventListeners() {
    const form = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('registerButton');
    const alertContainer = document.getElementById('alertContainer');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      // Validate inputs
      if (!nameInput.value.trim()) {
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            Please enter your name.
          </div>
        `;
        return;
      }
      
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
      
      if (passwordInput.value.length < 8) {
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            Password must be at least 8 characters.
          </div>
        `;
        return;
      }
      
      // Disable form during submission
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
      
      try {
        const response = await this.authModel.register({
          name: nameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
        });
        
        // Show success message
        alertContainer.innerHTML = `
          <div class="alert alert-success">
            ${response.message}! Please log in.
          </div>
        `;
        
        // Reset form
        form.reset();
        
        // Redirect to login after short delay
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 2000);
      } catch (error) {
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            ${error.message}
          </div>
        `;
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-user-plus"></i> Register';
      }
    });
  }
}

export default RegisterPage;
