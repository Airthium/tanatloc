module.exports = {
  process: function process() {
    return 'module.exports = {};';
  },
  getCacheKey: function getCacheKey() {
    return 'cssTransform';
  }
};