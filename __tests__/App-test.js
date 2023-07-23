import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import store from '../utils/Redux/store';
import App from '../App';

// Mock the RootSiblingParent component
jest.mock('react-native-root-siblings', () => ({
  RootSiblingParent: ({children}) => children,
}));

describe('App', () => {
  it('renders the SplashScreen on initial launch', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    await waitFor(() => expect(getByTestId('SplashScreen')).toBeDefined());
  });
});
