/**
 * Generate a login form component
 * @returns {string} HTML string
 */
const LoginForm = () => {
  return `
    <div id="alertContainer"></div>
    
    <form id="loginForm">
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
          placeholder="Enter your password"
          required
        >
      </div>
      
      <div class="form-group text-center">
        <button type="submit" id="loginButton" class="form-button">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
      </div>
      
      <p class="text-center" style="margin-top: 1rem;">
        Don't have an account? <a href="#/register">Register here</a>
      </p>
    </form>
  `;
};

export default LoginForm;
