module.exports = {
  manipulate: async (imageUri, manipulations, options) => {
    // Mock implementation that just returns a manipulated image with a new uri
    const manipulatedUri = `manipulated_${imageUri}`;
    return {uri: manipulatedUri};
  },
};
