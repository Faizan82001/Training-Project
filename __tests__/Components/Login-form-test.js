import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
const MESSAGES = require('../../utils/messages.json');
import api from '../../api/api';
import showToast from '../../utils/toast';
import LoginForm from '../../src/components/LoginForm';
import handleLogin from '../../utils/controllers/loginController';
import CryptoJS from 'react-native-crypto-js';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
  positions: {
    TOP: 'top',
  },
  show: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => {
  const getToken = jest.fn(() => '123');
  return () => ({
    getToken,
  });
});

jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
  return {
    get: param => {
      if (param === 'window') {
        return {
          width: 1000,
          height: 1000,
        };
      }
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Login Form', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    pop: jest.fn(),
    setParams: jest.fn(),
    replace: jest.fn(),
  };

  it('should render correctly in tablet mode', () => {
    store.dispatch(setIsTablet(true));
    const screen = render(
      <Provider store={store}>
        <LoginForm navigation={mockNavigation} />
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('should give error if required fields are empty', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <LoginForm navigation={mockNavigation} />
      </Provider>,
    );
    const button = getByTestId('login-button');
    fireEvent.press(button);
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(MESSAGES.FIELD_REQUIRED_MSG);
    });
  });

  it('should give error if email is invalid', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <LoginForm navigation={mockNavigation} />
      </Provider>,
    );
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    fireEvent.changeText(emailInput, 'wrongemail');
    fireEvent.changeText(passwordInput, 'correctpassword');
    const button = getByTestId('login-button');
    fireEvent.press(button);
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(MESSAGES.INVALID_EMAIL);
    });
  });

  it('should give error if password validation fails', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <LoginForm navigation={mockNavigation} />
      </Provider>,
    );
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    fireEvent.changeText(emailInput, 'abc@gmail.com');
    fireEvent.changeText(passwordInput, 'corre');
    const button = getByTestId('login-button');
    fireEvent.press(button);
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        'Password length must be at least 6 characters',
      );
    });
  });

  it('should navigate to forgot password screen when forgot password is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <LoginForm navigation={mockNavigation} />
      </Provider>,
    );
    const forgotPassword = getByTestId('forgot-password');
    fireEvent.press(forgotPassword);
    expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
  });

  const correctEmail = 'testemail@example.com';
  const correctPassword = 'correctpassword';
  const correctRoleId = 3;

  CryptoJS.AES.encrypt = jest.fn((text, key) => ({
    toString: () => `${text} (encrypted with ${key})`,
  }));
  // Mock implementation of users.post
  beforeEach(() => {
    api.post = jest.fn((url, data, headers) => {
      const roleId = 3;
      if (
        data.email === correctEmail &&
        data.password ===
          `${correctPassword} (encrypted with ${process.env.PASSWORD_ENCRYPTION_KEY})` &&
        roleId === correctRoleId
      ) {
        return Promise.resolve({status: 200});
      } else {
        return Promise.resolve({
          response: {
            status: 400,
            data: {
              message: 'Invalid email address or password',
            },
          },
        });
      }
    });
  });

  // Mock implementation

  // Mock implementation of navigation.pop
  it('should encrypt passwords and make API call with correct data', async () => {
    const response = {
      status: 200,
      data: {message: 'Logged in Successfully', data: {roleId: 3}},
    };

    api.post.mockResolvedValue(response);

    await handleLogin(correctEmail, correctPassword, mockNavigation);

    expect(api.post).toHaveBeenCalledWith('/api/auth/login', {
      email: expect.any(String),
      password: expect.any(String),
      fcmToken: expect.any(String),
    });
    expect(showToast).toHaveBeenCalledWith(response.data.message);
    expect(mockNavigation.replace).toHaveBeenCalledTimes(1);
  });

  it('should show an error message when role id is 3', async () => {
    const mockErrorResponse = {
      response: {
        status: 400,
        data: {
          message: 'User is not a Nurse',
        },
      },
    };
    api.post('/api/auth/login', {
      email: correctEmail,
      password: expect.any(String),
      fcmToken: expect.any(String),
    });

    await handleLogin(
      'incorrectemail@example.com',
      correctPassword,
      mockNavigation,
    );

    expect(showToast).toHaveBeenCalledWith(
      mockErrorResponse.response.data.message,
    );
  });

  it('should show an error message when there is a 500 response from the API', async () => {
    const mockErrorResponse = {
      response: {
        status: 500,
        data: {
          message: 'Something went wrong',
        },
      },
    };
    api.post.mockRejectedValue(mockErrorResponse);

    await handleLogin(
      'incorrectemail@example.com',
      correctPassword,
      mockNavigation,
    );

    expect(showToast).toHaveBeenCalledWith(
      mockErrorResponse.response.data.message,
    );
  });
});
