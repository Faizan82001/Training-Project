import React from 'react';
import {render} from '@testing-library/react-native';
import ValidationMenu from '../../src/components/PasswordValidationMenu';

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

const validationMessage =
  '. Minimum 8 and Maximum 20 characters\n' +
  '. At least 1 uppercase and 1 lowercase letter is mandatory\n' +
  '. At least 1 special character and 1 number is mandatory';

describe('ValidationMenu', () => {
  it('renders validation message correctly', () => {
    const {getByText} = render(<ValidationMenu />);
    const message = getByText(/Password should fulfill following conditions:/);
    expect(message).toBeTruthy();
    const conditions = getByText(validationMessage);
    expect(conditions).toBeTruthy();
  });
});
