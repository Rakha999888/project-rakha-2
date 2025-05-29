/**
 * Generate a story item component
 * @param {object} story - Story data
 * @returns {string} HTML string
 */
const StoryItem = (story) => {
  // Format date
  const createdAt = new Date(story.createdAt);
  const formattedDate = createdAt.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Truncate description if too long
  const maxDescriptionLength = 100;
  let description = story.description;
  
  if (description.length > maxDescriptionLength) {
    description = `${description.substring(0, maxDescriptionLength)}...`;
  }
  
  return `
    <article class="story-item">
      <img 
        src="${story.photoUrl}" 
        alt="Photo by ${story.name}" 
        class="story-item__image"
      >
      <div class="story-item__content">
        <h3 class="story-item__title">${story.name}</h3>
        <p class="story-item__info">
          <i class="fas fa-calendar"></i> ${formattedDate}
        </p>
        <p class="story-item__description">${description}</p>
        <a href="#/detail/${story.id}" class="form-button" style="margin-top: 10px; display: inline-block;">
          Read More
        </a>
      </div>
    </article>
  `;
};

export default StoryItem;
