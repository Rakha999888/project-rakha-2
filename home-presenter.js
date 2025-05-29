/**
 * Home Presenter
 * Connects HomePage view with StoryModel data
 */
class HomePresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
    this.page = 1;
    this.size = 10;
    this.showMap = false;
  }

  async init() {
    await this.loadStories();
  }

  async loadStories() {
    try {
      const response = await this.model.getStories({
        page: this.page,
        size: this.size,
        location: 1, // Always include location data for map
      });
      
      const stories = response.listStory || [];
      
      this.view.displayStories(stories);
      
      // Calculate total pages
      const totalItems = response.totalItems || stories.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / this.size));
      
      this.view.updatePagination({
        currentPage: this.page,
        pageSize: this.size,
        totalItems,
        totalPages,
      });
      
      if (this.showMap && stories.length > 0) {
        this.view.displayMap(stories.filter(story => story.lat && story.lon));
      } else if (this.showMap) {
        this.view.showMapError('No stories with location data available.');
      }
    } catch (error) {
      this.view.showError(`Failed to load stories: ${error.message}`);
    }
  }

  async goToPage(page) {
    if (page !== this.page) {
      this.page = page;
      await this.loadStories();
    }
  }

  async changePageSize(size) {
    if (size !== this.size) {
      this.size = size;
      this.page = 1;
      await this.loadStories();
    }
  }

  async toggleMap() {
    this.showMap = !this.showMap;
    
    if (this.showMap) {
      await this.loadStories();
    }
    
    return this.showMap;
  }
}

export default HomePresenter;