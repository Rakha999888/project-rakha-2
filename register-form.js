/**
 * Generate a registration form component
 * @returns {string} HTML string
 */
const RegisterForm = () => {
  return `
    <div id="alertContainer"></div>
    
    <form id="registerForm">
      <div class="form-group">
        <label for="name" class="form-label">Name</label>
        <input 
          type="text" 
          id="name" 
          class="form-input"
          placeholder="Enter your name"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input 
          type="email" 
          id="email" 
          class="form-input"
          placeholder="Enter your email"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input 
          type="password" 
          id="password" 
          class="form-input"
          placeholder="Enter your password (min. 8 characters)"
          minlength="8"
          required
        >
      </div>
      
      <div class="form-group text-center">
        <button type="submit" id="registerButton" class="form-button">
          <i class="fas fa-user-plus"></i> Register
        </button>
      </div>
      
      <p class="text-center" style="margin-top: 1rem;">
        Already have an account? <a href="#/login">Login here</a>
      </p>
    </form>
  `;
};

export default RegisterForm;
