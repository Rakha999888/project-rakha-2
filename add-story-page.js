import { applyTransitionClass } from '../../utils/view-transitions';
import StoryModel from '../../models/story-model';
import StoryForm from '../components/story-form';
import AuthModel from '../../models/auth-model';

class AddStoryPage {
  constructor() {
    this.storyModel = new StoryModel();
    this.authModel = new AuthModel();
    this.isAuthenticated = this.authModel.isAuthenticated();
  }

  getTemplate() {
    applyTransitionClass('add');
    
    if (!this.isAuthenticated) {
      return `
        <section class="content">
          <h2 class="text-center">Add New Story</h2>
          
          <div class="alert alert-info" style="margin: 20px 0;">
            <p>You need to <a href="#/login">login</a> to add a story.</p>
            <div style="margin-top: 10px;">
              <a href="#/login" class="form-button">Login</a>
              <a href="#/register" class="form-button">Register</a>
            </div>
          </div>
        </section>
      `;
    }
    
    return `
      <section class="content">
        <h2 class="text-center">Add New Story</h2>
        
        <div id="addStoryForm" class="form-container">
          ${StoryForm()}
        </div>
      </section>
    `;
  }

  async afterRender() {
    if (!this.isAuthenticated) {
      // Add event listeners for login and register buttons if present
      const loginButton = document.querySelector('a[href="#/login"]');
      const registerButton = document.querySelector('a[href="#/register"]');
      
      if (loginButton) {
        loginButton.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.hash = '/login';
        });
      }
      
      if (registerButton) {
        registerButton.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.hash = '/register';
        });
      }
      
      return;
    }
    
    this._initEventListeners();
    this._initMap();
  }

  _initEventListeners() {
    const form = document.getElementById('storyForm');
    const descriptionInput = document.getElementById('description');
    const photoInput = document.getElementById('photo');
    const cameraButton = document.getElementById('cameraButton');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const submitButton = document.getElementById('submitButton');
    const alertContainer = document.getElementById('alertContainer');

    // Photo input change
    photoInput.addEventListener('change', (event) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        
        // Check file size (max 1MB)
        if (file.size > 1024 * 1024) {
          alertContainer.innerHTML = `
            <div class="alert alert-error">
              Image size exceeds 1MB limit. Please choose a smaller image.
            </div>
          `;
          photoInput.value = '';
          previewContainer.classList.add('hidden');
          return;
        }
        
        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      } else {
        previewContainer.classList.add('hidden');
      }
    });

    // Camera button click
    if ('mediaDevices' in navigator) {
      cameraButton.addEventListener('click', async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // Create camera UI
          const cameraContainer = document.createElement('div');
          cameraContainer.className = 'camera-container';
          cameraContainer.innerHTML = `
            <video class="camera-preview" autoplay></video>
            <div>
              <button class="camera-button" id="captureButton">
                <i class="fas fa-camera"></i> Capture
              </button>
              <button class="camera-button" id="cancelCameraButton">
                <i class="fas fa-times"></i> Cancel
              </button>
            </div>
          `;
          
          form.insertBefore(cameraContainer, form.firstChild);
          
          const video = document.querySelector('.camera-preview');
          video.srcObject = stream;
          
          // Handle cancel button
          document.getElementById('cancelCameraButton').addEventListener('click', () => {
            stream.getTracks().forEach(track => track.stop());
            cameraContainer.remove();
          });
          
          // Handle capture button
          document.getElementById('captureButton').addEventListener('click', () => {
            // Create canvas to capture image
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            
            // Convert to file
            canvas.toBlob(async (blob) => {
              const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
              
              // Create a file list-like object
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              photoInput.files = dataTransfer.files;
              
              // Show preview
              previewImage.src = URL.createObjectURL(blob);
              previewContainer.classList.remove('hidden');
              
              // Clean up camera
              stream.getTracks().forEach(track => track.stop());
              cameraContainer.remove();
            }, 'image/jpeg');
          });
        } catch (error) {
          console.error('Camera access error:', error);
          alertContainer.innerHTML = `
            <div class="alert alert-error">
              Could not access camera: ${error.message}
            </div>
          `;
        }
      });
    } else {
      cameraButton.classList.add('hidden');
    }

    // Form submission
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      // Validate inputs
      if (!descriptionInput.value.trim()) {
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            Please enter a description for your story.
          </div>
        `;
        return;
      }
      
      if (!photoInput.files || !photoInput.files[0]) {
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            Please select an image for your story.
          </div>
        `;
        return;
      }
      
      // Get coordinate values
      const lat = document.getElementById('latitude').value
        ? parseFloat(document.getElementById('latitude').value)
        : undefined;
      
      const lon = document.getElementById('longitude').value
        ? parseFloat(document.getElementById('longitude').value)
        : undefined;
      
      // Disable form during submission
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      
      try {
        const response = await this.storyModel.addStory({
          description: descriptionInput.value,
          photo: photoInput.files[0],
          lat,
          lon,
        });
        
        // Show success message
        alertContainer.innerHTML = `
          <div class="alert alert-success">
            Story added successfully!
          </div>
        `;
        
        // Reset form
        form.reset();
        previewContainer.classList.add('hidden');
        
        // Remove location marker if exists
        if (this.map && this.marker) {
          this.marker.remove();
          this.marker = null;
          document.getElementById('latitude').value = '';
          document.getElementById('longitude').value = '';
          document.getElementById('locationInfo').classList.add('hidden');
        }
        
        // Redirect to home after short delay
        setTimeout(() => {
          window.location.hash = '#/';
        }, 2000);
      } catch (error) {
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            Failed to add story: ${error.message}
          </div>
        `;
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Story';
      }
    });
  }

  _initMap() {
    try {
      // Initialize the map
      this.map = L.map('locationSelector').setView([-2.5489, 118.0149], 5);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      
      // Add click event to map
      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker if any
        if (this.marker) {
          this.marker.remove();
        }
        
        // Add marker at clicked position
        this.marker = L.marker([lat, lng]).addTo(this.map);
        
        // Update form fields
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);
        
        // Show location info
        const locationInfo = document.getElementById('locationInfo');
        locationInfo.innerHTML = `
          Selected location: <span class="location-coordinates">${lat.toFixed(6)}, ${lng.toFixed(6)}</span>
        `;
        locationInfo.classList.remove('hidden');
      });
    } catch (error) {
      console.error('Map initialization error:', error);
      document.getElementById('locationSelector').innerHTML = `
        <div class="alert alert-error">
          Failed to load map: ${error.message}
        </div>
      `;
    }
  }
}

export default AddStoryPage;
