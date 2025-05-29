/**
 * Add Story Presenter
 * Connects AddStoryPage view with StoryModel data
 */
class AddStoryPresenter {
  /**
   * Constructor
   * @param {object} view - AddStoryPage instance
   * @param {object} model - StoryModel instance
   */
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  /**
   * Initialize presenter
   */
  init() {
    this.view.bindAddStory(this.addStory.bind(this));
  }

  /**
   * Add a new story
   * @param {object} storyData - Story data
   * @param {string} storyData.description - Story description
   * @param {File} storyData.photo - Photo file
   * @param {number} storyData.lat - Latitude (optional)
   * @param {number} storyData.lon - Longitude (optional)
   * @returns {Promise<object>} Response from API
   */
  async addStory({ description, photo, lat, lon }) {
    try {
      this.view.setLoading(true);
      
      // Validate inputs
      if (!description.trim()) {
        throw new Error('Please enter a description for your story');
      }
      
      if (!photo) {
        throw new Error('Please select an image for your story');
      }
      
      // Check file size (max 1MB)
      if (photo.size > 1024 * 1024) {
        throw new Error('Image size exceeds 1MB limit. Please choose a smaller image');
      }
      
      // Send request
      const response = await this.model.addStory({
        description,
        photo,
        lat: lat !== undefined ? parseFloat(lat) : undefined,
        lon: lon !== undefined ? parseFloat(lon) : undefined,
      });
      
      this.view.showSuccess('Story added successfully!');
      
      return response;
    } catch (error) {
      this.view.showError(error.message);
      throw error;
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default AddStoryPresenter;
