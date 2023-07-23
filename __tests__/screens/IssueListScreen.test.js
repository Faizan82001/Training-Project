import React from 'react';
import {render} from '@testing-library/react-native';
import IssueListScreen from '../../src/screens/ReportIssueScreens/IssueListScreen';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';
import IssueItem from '../../src/components/ReportIssueComponents/IssueItem';
import IssueListComponent from '../../src/components/ReportIssueComponents/IssueListComponent';

jest.mock(
  '../../utils/controllers/ReportIssueControllers/issueListController',
  () =>
    jest.fn().mockImplementation(() => {
      return {
        data: [{id: 1, title: 'Issue'}],
      };
    }),
);

describe('IssueListScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  it('should render IssueTopBar and IssueListComponent', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <IssueListScreen navigation={mockNavigation} />
      </Provider>,
    );
    const topBar = getByTestId('issue-top-bar');
    const listComponent = getByTestId('issue-list-component');
    expect(topBar).toBeDefined();
    expect(listComponent).toBeDefined();
  });

  it('should render IssueListComponent', () => {
    const screen = render(
      <Provider store={store}>
        <IssueListComponent
          navigation={mockNavigation}
          issueList={[{title: 'New Title', id: '123456'}]}
        />
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('should render Issue Item in tablet', () => {
    store.dispatch(setIsTablet(true));
    const {getByTestId} = render(
      <Provider store={store}>
        <IssueItem item={{id: '123456', title: 'New Title'}} />
      </Provider>,
    );
    const issueItem = getByTestId('issue-item');
    expect(issueItem).toBeDefined();
  });
});
