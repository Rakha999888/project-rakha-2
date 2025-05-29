/**
 * Map View Component
 * Handles map display and markers using Leaflet
 */
class MapView {
  /**
   * Constructor
   * @param {object} options - Map options
   * @param {string} options.containerId - ID of the container element
   * @param {array} options.center - Map center coordinates [lat, lon]
   * @param {number} options.zoom - Initial zoom level
   */
  constructor({ containerId, center, zoom }) {
    this.containerId = containerId;
    this.center = center;
    this.zoom = zoom;
    this.markers = [];
    
    this._initializeMap();
  }

  /**
   * Initialize Leaflet map
   * @private
   */
  _initializeMap() {
    // Create a map instance
    this.map = L.map(this.containerId).setView(this.center, this.zoom);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  /**
   * Add a single marker to the map
   * @param {object} story - Story data with location
   */
  addMarker(story) {
    // Create marker
    const marker = L.marker([story.lat, story.lon]).addTo(this.map);
    
    // Create popup content
    const popupContent = `
      <div class="map-popup">
        <img 
          src="${story.photoUrl}" 
          alt="Photo by ${story.name}" 
          class="map-popup-image"
        >
        <h3 class="map-popup-title">${story.name}</h3>
        <p class="map-popup-content">
          ${story.description.length > 50 
            ? story.description.substring(0, 50) + '...' 
            : story.description}
        </p>
        <a href="#/detail/${story.id}" class="map-popup-link">
          Read more
        </a>
      </div>
    `;
    
    // Bind popup to marker
    marker.bindPopup(popupContent);
    
    // Store marker
    this.markers.push(marker);
    
    return marker;
  }

  /**
   * Add multiple markers to the map
   * @param {array} stories - Array of stories with location data
   */
  addMarkers(stories) {
    stories.forEach(story => this.addMarker(story));
    
    // If there are markers, fit the map to show all markers
    if (this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  /**
   * Clear all markers from the map
   */
  clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  /**
   * Re-render the map (useful when container size changes)
   */
  invalidateSize() {
    this.map.invalidateSize();
  }
}

export default MapView;
