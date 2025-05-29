/**
 * Drawer Initiator - handles mobile navigation drawer
 */
const DrawerInitiator = {
  /**
   * Initialize drawer
   * @param {object} options - Drawer elements
   * @param {HTMLElement} options.button - Hamburger button
   * @param {HTMLElement} options.drawer - Drawer element
   * @param {HTMLElement} options.content - Main content
   */
  init({ button, drawer, content }) {
    // Handle click on hamburger button
    button.addEventListener('click', (event) => {
      this._toggleDrawer(event, drawer);
    });

    // Close drawer when clicking main content
    content.addEventListener('click', (event) => {
      this._closeDrawer(event, drawer);
    });
  },

  /**
   * Toggle drawer open/close
   * @param {Event} event - Click event
   * @param {HTMLElement} drawer - Drawer element
   * @private
   */
  _toggleDrawer(event, drawer) {
    event.stopPropagation();
    drawer.classList.toggle('open');
  },

  /**
   * Close drawer
   * @param {Event} event - Click event
   * @param {HTMLElement} drawer - Drawer element
   * @private
   */
  _closeDrawer(event, drawer) {
    event.stopPropagation();
    drawer.classList.remove('open');
  },
};

export default DrawerInitiator;
