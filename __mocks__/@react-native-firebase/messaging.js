jest.mock('@react-native-firebase/messaging', () => {
  const setBackgroundMessageHandler = jest.fn();
  const onMessage = jest.fn();
  const getToken = jest.fn();

  return () => ({
    setBackgroundMessageHandler,
    onMessage,
    getToken,
  });
});
