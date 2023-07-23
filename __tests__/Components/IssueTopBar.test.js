import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import IssueTopBar from '../../src/components/ReportIssueComponents/IssueTopBar';
import {PREVIOUS_ISSUES, REPORT_ISSUE} from '../../src/constants/constants';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';

const mockNavigation = {
  pop: jest.fn(),
  replace: jest.fn(),
};

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('IssueTopBar', () => {
  it('should navigate back when back button is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <IssueTopBar navigation={mockNavigation} />
      </Provider>,
    );
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
    expect(mockNavigation.pop).toHaveBeenCalled();
  });

  it('should render screen with previous issue as active tab', () => {
    const screen = render(
      <Provider store={store}>
        <IssueTopBar navigation={mockNavigation} activeTab={PREVIOUS_ISSUES} />
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('should render screen with report issue as active tab', () => {
    const screen = render(
      <Provider store={store}>
        <IssueTopBar navigation={mockNavigation} activeTab={REPORT_ISSUE} />
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('should render screen with report issue as active tab in tablet screen', () => {
    const screen = render(
      <Provider store={store}>
        <IssueTopBar navigation={mockNavigation} activeTab={REPORT_ISSUE} />
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('should go to report issue screen when report issue button is clicked', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <IssueTopBar navigation={mockNavigation} activeTab={REPORT_ISSUE} />
      </Provider>,
    );
    const reportIssueButton = getByTestId('report-issue-screen');
    fireEvent.press(reportIssueButton);
    expect(mockNavigation.replace).toHaveBeenCalled();
  });

  it('should go to issue list screen when issue list button is clicked', () => {
    store.dispatch(setIsTablet(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <IssueTopBar navigation={mockNavigation} activeTab={REPORT_ISSUE} />
      </Provider>,
    );
    const issueListScreen = getByTestId('issue-list-screen');
    fireEvent.press(issueListScreen);
    expect(mockNavigation.replace).toHaveBeenCalled();
  });
});
