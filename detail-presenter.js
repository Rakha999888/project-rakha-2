/**
 * Detail Presenter
 * Connects DetailPage view with StoryModel data
 */
class DetailPresenter {
  /**
   * Constructor
   * @param {object} view - DetailPage instance
   * @param {object} model - StoryModel instance
   * @param {string} storyId - Story ID
   */
  constructor({ view, model, storyId }) {
    this.view = view;
    this.model = model;
    this.storyId = storyId;
  }

  /**
   * Initialize presenter
   */
  async init() {
    await this.loadStoryDetail();
  }

  /**
   * Load story detail from API
   */
  async loadStoryDetail() {
    try {
      this.view.setLoading(true);
      
      if (!this.storyId) {
        throw new Error('Story ID is required');
      }
      
      const response = await this.model.getStoryDetail(this.storyId);
      
      this.view.displayStoryDetail(response.story);
      
      if (response.story.lat && response.story.lon) {
        this.view.displayMap(response.story);
      }
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default DetailPresenter;
