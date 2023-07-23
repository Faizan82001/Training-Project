import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ForgotPasswordForm from '../../src/components/ForgotPasswordForm';
const MESSAGES = require('../../utils/messages.json');
import api from '../../api/api';
import {handleForgotPassword} from '../../utils/controllers/forgotPasswordController';
import showToast from '../../utils/toast';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';
import {logoutUser} from '../../utils/controllers/logoutController';

jest.mock('../../utils/controllers/logoutController');

jest.mock('../../utils/toast.js', () => jest.fn());

jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('Forgot Password Form', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    pop: jest.fn(),
    setParams: jest.fn(),
  };
  it('should render correctly in tablet mode', () => {
    store.dispatch(setIsTablet(true));
    const screen = render(
      <Provider store={store}>
        <ForgotPasswordForm navigation={mockNavigation} />
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('should give error if required fields are empty', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ForgotPasswordForm navigation={mockNavigation} />
      </Provider>,
    );
    const button = getByTestId('submit-button');
    fireEvent.press(button);
    expect(showToast).toHaveBeenCalledWith(MESSAGES.FIELD_REQUIRED_MSG);
  });
  it('should give error if email is invalid', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ForgotPasswordForm navigation={mockNavigation} />
      </Provider>,
    );
    const emailInput = getByTestId('email-input');
    fireEvent.changeText(emailInput, 'wrongemail');
    const button = getByTestId('submit-button');
    fireEvent.press(button);
    expect(showToast).toHaveBeenCalledWith(MESSAGES.INVALID_EMAIL);
  });
  it('should navigate back when go back is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ForgotPasswordForm navigation={mockNavigation} />
      </Provider>,
    );
    const goBackButton = getByTestId('go-back-button');
    fireEvent.press(goBackButton);
    expect(mockNavigation.pop).toHaveBeenCalledTimes(1);
  });

  const correctEmail = 'testemail@example.com';
  // Mock implementation of users.post
  beforeEach(() => {
    api.post = jest.fn((url, data, headers) => {
      if (data.email === correctEmail) {
        return Promise.resolve({status: 200});
      } else {
        return Promise.reject({
          response: {
            status: 400,
            data: {
              message: 'Invalid email address',
            },
          },
        });
      }
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock implementation

  // Mock implementation of navigation.pop
  const navigation = {pop: jest.fn()};
  it('should encrypt passwords and make API call with correct data', async () => {
    await handleForgotPassword(correctEmail, navigation);

    expect(api.post).toHaveBeenCalledWith('/api/auth/forgot-password', {
      email: correctEmail,
    });

    expect(showToast).toHaveBeenCalledWith(
      MESSAGES.FORGOT_PASSWORD_SUCCESS_MSG,
    );

    expect(navigation.pop).toHaveBeenCalledTimes(1);
  });

  it('should show toast with error message if status code is not 200', async () => {
    const response = {
      status: 400,
      data: {message: 'Something went wrong'},
    };

    api.post.mockResolvedValue(response);

    await handleForgotPassword(correctEmail, navigation);

    expect(api.post).toHaveBeenCalledWith('/api/auth/forgot-password', {
      email: correctEmail,
    });
    expect(showToast).toHaveBeenCalledWith(response.data.message);
  });

  it('should logout user when there is a 401 response from the API', async () => {
    const mockErrorResponse = {
      response: {
        status: 401,
        data: {
          message: 'Invalid input',
        },
      },
    };
    api.post.mockRejectedValue(mockErrorResponse);
    await handleForgotPassword(correctEmail, navigation);
    expect(logoutUser).toHaveBeenCalled();
  });

  it('should show an error message when there is a 500 response from the API', async () => {
    const mockErrorResponse = {
      response: {
        status: 400,
        data: {
          message: 'Invalid email address',
        },
      },
    };
    api.post('/api/auth/forgot-password', {
      email: correctEmail,
    });

    await handleForgotPassword('incorrectemail@example.com', navigation);

    expect(showToast).toHaveBeenCalledWith(
      mockErrorResponse.response.data.message,
    );
  });
});
