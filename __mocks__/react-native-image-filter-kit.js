const React = require('react');
const {Image} = require('react-native');

module.exports = {
  Grayscale: jest
    .fn()
    .mockImplementation(({children, onExtractImage, ...props}) => {
      // Mock the behavior of the onExtractImage callback
      const handleExtractImage = () => {
        // Create a mock nativeEvent object
        const nativeEvent = {
          // Add any desired properties to the nativeEvent object
          // For example:
          target: 'mockTarget',
          // ...
        };

        // Call the onExtractImage callback with the mock nativeEvent
        onExtractImage({nativeEvent});
      };

      return React.createElement(
        Image,
        {...props, onExtractImage: handleExtractImage},
        React.createElement(React.Fragment, null, children),
      );
    }),
};
