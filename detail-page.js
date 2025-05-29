import { applyTransitionClass } from '../../utils/view-transitions';
import UrlParser from '../../routes/url-parser';
import StoryModel from '../../models/story-model';
import AuthModel from '../../models/auth-model';
import MapView from '../components/map-view';

class DetailPage {
  constructor() {
    this.storyModel = new StoryModel();
    this.authModel = new AuthModel();
    this.isAuthenticated = this.authModel.isAuthenticated();
  }

  getTemplate() {
    applyTransitionClass('detail');
    
    if (!this.isAuthenticated) {
      return `
        <section class="content">
          <h2 class="text-center">Story Detail</h2>
          
          <div class="alert alert-info" style="margin: 20px 0;">
            <p>You need to <a href="#/login">login</a> to view story details.</p>
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
        <div class="story-detail" id="storyDetail">
          <div class="loader">
            <div></div><div></div><div></div><div></div>
          </div>
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
    
    await this._loadStoryDetail();
  }

  async _loadStoryDetail() {
    try {
      const url = UrlParser.parseActiveUrlWithCombiner();
      const storyId = url.id;
      
      if (!storyId) {
        throw new Error('Story ID is required');
      }
      
      const response = await this.storyModel.getStoryDetail(storyId);
      // Handle different response format for guest endpoint
      const story = response.story || response;
      
      this._renderStoryDetail(story);
      
      // Initialize map if the story has location data
      if (story.lat && story.lon) {
        this._initMap(story);
      }
    } catch (error) {
      document.getElementById('storyDetail').innerHTML = `
        <div class="alert alert-error">
          Failed to load story: ${error.message}
        </div>
        <a href="#/" class="form-button">Back to Home</a>
      `;
    }
  }

  _renderStoryDetail(story) {
    const storyDetailElement = document.getElementById('storyDetail');
    
    // Format date
    const createdAt = new Date(story.createdAt);
    const formattedDate = createdAt.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    storyDetailElement.innerHTML = `
      <a href="#/" class="form-button" style="margin-bottom: 1rem;">
        <i class="fas fa-arrow-left"></i> Back to Home
      </a>
      
      <img 
        src="${story.photoUrl}" 
        alt="Photo by ${story.name}" 
        class="story-detail__image"
      >
      
      <div class="story-detail__content">
        <h2 class="story-detail__title">Story by ${story.name}</h2>
        <p class="story-detail__info">
          <i class="fas fa-calendar"></i> ${formattedDate}
        </p>
        <p class="story-detail__description">${story.description}</p>
      </div>
      
      ${story.lat && story.lon ? `
        <div class="map-container" id="mapContainer"></div>
      ` : ''}
    `;
  }

  _initMap(story) {
    try {
      const mapView = new MapView({
        containerId: 'mapContainer',
        center: [story.lat, story.lon],
        zoom: 13,
      });
      
      // Add marker for the story location
      mapView.addMarker({
        lat: story.lat,
        lon: story.lon,
        name: story.name,
        description: story.description,
        photoUrl: story.photoUrl,
        id: story.id,
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
      const mapContainer = document.getElementById('mapContainer');
      mapContainer.innerHTML = `
        <div class="alert alert-error">
          Failed to load map: ${error.message}
        </div>
      `;
    }
  }
}

export default DetailPage;
