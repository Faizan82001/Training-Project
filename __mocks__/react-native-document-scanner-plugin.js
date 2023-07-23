module.exports = {
  scanDocument: jest.fn().mockImplementation(() => ({
    scannedImages: ['scannedImageMock'],
  })),
};
