import React, {useState} from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import ChangePasswordForm from '../../src/components/ChangePasswordForm';
import api from '../../api/api';
import CryptoJS from 'react-native-crypto-js';
import {handleChangePassword} from '../../utils/controllers/changePasswordController';
const MESSAGES = require('../../utils/messages.json');
import showToast from '../../utils/toast';
import {logoutUser} from '../../utils/controllers/logoutController';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
jest.mock('../../utils/controllers/logoutController');
jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });
  it('submitting empty fields shows error message', async () => {
    store.dispatch(setIsTablet(true));
    const component = render(
      <Provider store={store}>
        <ChangePasswordForm />
      </Provider>,
    );
    fireEvent.press(component.getByTestId('submit-button'));
    expect(showToast).toHaveBeenCalledWith(MESSAGES.FIELD_REQUIRED_MSG);
  });

  it('password fields are masked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ChangePasswordForm />
      </Provider>,
    );
    const newPasswordInput = getByTestId('new-password-input');
    const confirmPasswordInput = getByTestId('confirm-password-input');
    expect(newPasswordInput.props.secureTextEntry).toBe(true);
    expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
  });

  it('info icon opens validation menu', () => {
    const setIsMenuVisible = jest.fn();
    useState.mockImplementation(() => [true, setIsMenuVisible]);
    const component = render(
      <Provider store={store}>
        <ChangePasswordForm />
      </Provider>,
    );
    const icon = component.getByTestId('toggle-button');
    fireEvent.press(icon);
    expect(setIsMenuVisible).toHaveBeenCalled();
  });

  it('new password and confirm password mismatch gives error', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ChangePasswordForm />
      </Provider>,
    );
    const oldPasswordInput = getByTestId('old-password-input');
    const newPasswordInput = getByTestId('new-password-input');
    const confirmPasswordInput = getByTestId('confirm-password-input');
    const submitButton = getByTestId('submit-button');
    fireEvent.changeText(oldPasswordInput, 'old password');
    fireEvent.changeText(newPasswordInput, 'new password');
    fireEvent.changeText(confirmPasswordInput, 'mismatched password');
    fireEvent.press(submitButton);

    expect(showToast).toHaveBeenCalledWith(MESSAGES.PASSWORD_NOT_MATCH);
  });

  CryptoJS.AES.encrypt = jest.fn((text, key) => ({
    toString: () => `${text} (encrypted with ${key})`,
  }));

  const correctOldPass = 'OldPassword123!';
  const correctNewPass = 'NewPassword123!';
  // Mock implementation of users.post
  beforeEach(() => {
    api.post = jest.fn((url, data, headers) => {
      if (
        data.oldPassword ===
          `${correctOldPass} (encrypted with ${process.env.PASSWORD_ENCRYPTION_KEY})` &&
        data.newPassword ===
          `${correctNewPass} (encrypted with ${process.env.PASSWORD_ENCRYPTION_KEY})` &&
        data.confirmPassword ===
          `${correctNewPass} (encrypted with ${process.env.PASSWORD_ENCRYPTION_KEY})`
      ) {
        return Promise.resolve({status: 200});
      } else {
        return Promise.reject({
          response: {
            status: 400,
            data: {
              message: 'Invalid input',
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

  const setMenuVisibility = jest.fn();
  const setOldPassword = jest.fn();
  const setNewPassword = jest.fn();
  const setConfirmPassword = jest.fn();

  // Mock implementation of navigation.pop
  const navigation = {pop: jest.fn()};
  it('should encrypt passwords and make API call with correct data', async () => {
    const response = {
      status: 200,
      data: {message: 'Password changed successfully!'},
    };

    api.post.mockResolvedValue(response);

    await handleChangePassword(
      correctOldPass,
      correctNewPass,
      correctNewPass,
      navigation,
      setOldPassword,
      setNewPassword,
      setConfirmPassword,
      setMenuVisibility,
    );

    expect(api.post).toHaveBeenCalledWith(
      '/api/auth/change-password',
      {
        oldPassword: expect.any(String),
        newPassword: expect.any(String),
        confirmPassword: expect.any(String),
      },
      {
        headers: {
          Authorization: `Bearer null`,
        },
      },
    );
    expect(showToast).toHaveBeenCalledWith(response.data.message);
  });

  it('should show toast with error message if status code is not 200', async () => {
    const response = {
      status: 400,
      data: {message: 'Something went wrong'},
    };

    api.post.mockResolvedValue(response);

    await handleChangePassword(
      correctOldPass,
      correctNewPass,
      correctNewPass,
      navigation,
      setOldPassword,
      setNewPassword,
      setConfirmPassword,
      setMenuVisibility,
    );

    expect(api.post).toHaveBeenCalledWith(
      '/api/auth/change-password',
      {
        oldPassword: expect.any(String),
        newPassword: expect.any(String),
        confirmPassword: expect.any(String),
      },
      {
        headers: {
          Authorization: `Bearer null`,
        },
      },
    );
    expect(showToast).toHaveBeenCalledWith(response.data.message);
  });

  it('should show an error message when passwords dont validate', async () => {
    await handleChangePassword(
      'oldPassword',
      'newPassword',
      'newPassword',
      navigation,
      setOldPassword,
      setNewPassword,
      setConfirmPassword,
      setMenuVisibility,
    );
    expect(showToast).toHaveBeenCalledWith(MESSAGES.INVALID_PASSWORD);
    expect(setMenuVisibility).toHaveBeenCalledWith(true);
  });

  it('should show an error message when there is a 500 response from the API', async () => {
    const mockErrorResponse = {
      response: {
        status: 400,
        data: {
          message: 'Invalid input',
        },
      },
    };
    api.post(
      '/api/auth/change-password',
      {
        oldPassword:
          'OldPassword123! (encrypted with ' +
          process.env.PASSWORD_ENCRYPTION_KEY +
          ')',
        newPassword:
          'NewPassword123! (encrypted with ' +
          process.env.PASSWORD_ENCRYPTION_KEY +
          ')',
        confirmPassword:
          'NewPassword123! (encrypted with ' +
          process.env.PASSWORD_ENCRYPTION_KEY +
          ')',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      },
    );

    await handleChangePassword(
      'abc',
      correctNewPass,
      correctNewPass,
      navigation,
      setOldPassword,
      setNewPassword,
      setConfirmPassword,
      setMenuVisibility,
    );

    expect(showToast).toHaveBeenCalledWith(
      mockErrorResponse.response.data.message,
    );
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
    await handleChangePassword(
      'abc',
      correctNewPass,
      correctNewPass,
      navigation,
      setOldPassword,
      setNewPassword,
      setConfirmPassword,
      setMenuVisibility,
    );

    expect(logoutUser).toHaveBeenCalled();
  });
});
