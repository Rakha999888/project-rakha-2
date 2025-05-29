/**
 * URL Parser to get the URL components from the active URL
 */
const UrlParser = {
  /**
   * Parse the active URL and split it into parts
   * @returns {object} URL parts including resource, id, verb
   */
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splitUrl = this._urlSplitter(url);
    return this._urlCombiner(splitUrl);
  },

  /**
   * Parse the active URL and return the resource name only
   * @returns {string} Resource name
   */
  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    return this._urlSplitter(url).resource;
  },

  /**
   * Split URL into resource, id, and verb
   * @param {string} url - URL to split
   * @returns {object} Split URL parts
   * @private
   */
  _urlSplitter(url) {
    const urlsSplits = url.split('/');
    return {
      resource: urlsSplits[1] || null,
      id: urlsSplits[2] || null,
      verb: urlsSplits[3] || null,
    };
  },

  /**
   * Combine URL parts into a readable format
   * @param {object} splitUrl - Split URL parts
   * @returns {object} Combined URL
   * @private
   */
  _urlCombiner(splitUrl) {
    return {
      resource: splitUrl.resource || null,
      id: splitUrl.id || null,
      verb: splitUrl.verb || null,
    };
  },
};

export default UrlParser;
