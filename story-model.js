/**
 * Story Model - handles data-related operations for stories
 */
class StoryModel {
  constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  async getStories({ page = 1, size = 10, location = 0 } = {}) {
    try {
      const token = this._getToken();
      const url = `${this.baseUrl}/stories?page=${page}&size=${size}&location=${location}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseJson = await response.json();
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return {
        ...responseJson,
        listStory: responseJson.listStory || [],
      };
    } catch (error) {
      throw new Error(`Failed to fetch stories: ${error.message}`);
    }
  }

  async getStoryDetail(id) {
    try {
      const token = this._getToken();
      const url = `${this.baseUrl}/stories/${id}`;

      const response = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseJson = await response.json();
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      if (!responseJson.story) {
        throw new Error('Story not found');
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Failed to fetch story detail: ${error.message}`);
    }
  }

  async addStory({ description, photo, lat, lon }) {
    try {
      const token = this._getToken();
      
      if (!token) {
        throw new Error('Authentication required to add a story');
      }
      
      const formData = new FormData();
      
      formData.append('description', description);
      formData.append('photo', photo);
      
      if (lat !== undefined && lon !== undefined) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }

      const url = `${this.baseUrl}/stories`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseJson = await response.json();
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Failed to add story: ${error.message}`);
    }
  }

  _getToken() {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    return auth.token || null;
  }
}

export default StoryModel;