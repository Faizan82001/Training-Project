import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ReportIssueScreen from '../../src/screens/ReportIssueScreens/ReportIssueScreen';
import {handleSubmitIssue} from '../../utils/controllers/submitIssueController';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import ReportIssueForm from '../../src/components/ReportIssueComponents/ReportIssueForm';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';

jest.mock('../../utils/controllers/submitIssueController.js');

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

const mockNavigation = {
  navigate: jest.fn(),
  pop: jest.fn(),
  dispatch: jest.fn(),
};

describe('ReportIssueScreen', () => {
  it('should render report issue screen', () => {
    const screen = render(
      <Provider store={store}>
        <ReportIssueScreen />
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('should render report issue form', () => {
    store.dispatch(setIsTablet(true));
    const screen = render(
      <Provider store={store}>
        <ReportIssueForm navigation={mockNavigation} />
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('should call hanldeSubmitIssue when submit button is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ReportIssueScreen />
      </Provider>,
    );
    const submitButton = getByTestId('submit-button');
    fireEvent.press(submitButton);
    expect(handleSubmitIssue).toHaveBeenCalled();
  });
});
