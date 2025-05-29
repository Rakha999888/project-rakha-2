/**
 * Generate a story form component
 * @returns {string} HTML string
 */
const StoryForm = () => {
  return `
    <div id="alertContainer"></div>
    
    <form id="storyForm">
      <div class="form-group">
        <label for="description" class="form-label">Story Description</label>
        <textarea 
          id="description" 
          class="form-textarea"
          placeholder="Write your story here..."
          required
        ></textarea>
      </div>
      
      <div class="form-group">
        <label class="form-label">Photo</label>
        <div>
          <label for="photo" class="file-input-label">
            <i class="fas fa-upload"></i> Choose Photo
          </label>
          <input 
            type="file" 
            id="photo" 
            class="file-input"
            accept="image/*"
            required
          >
          <button type="button" id="cameraButton" class="form-button">
            <i class="fas fa-camera"></i> Use Camera
          </button>
        </div>
        <div id="previewContainer" class="preview-container hidden">
          <img id="previewImage" class="preview-image">
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label">Location</label>
        <p>Click on the map to select your story location (optional)</p>
        <div id="locationSelector" class="map-container" style="height: 300px;"></div>
        <div id="locationInfo" class="location-info hidden"></div>
        
        <!-- Hidden inputs for coordinates -->
        <input type="hidden" id="latitude" name="latitude">
        <input type="hidden" id="longitude" name="longitude">
      </div>
      
      <div class="form-group text-center">
        <button type="submit" id="submitButton" class="form-button">
          <i class="fas fa-paper-plane"></i> Submit Story
        </button>
      </div>
    </form>
  `;
};

export default StoryForm;
