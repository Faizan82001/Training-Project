import React from 'react';
import {render} from '@testing-library/react-native';
import IssueItem from '../../src/components/ReportIssueComponents/IssueItem';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';

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

describe('IssueItem', () => {
  const mockIssue = {
    id: '123',
    title: 'Example Issue',
  };

  it('renders issue title and id', () => {
    const {getByText} = render(
      <Provider store={store}>
        <IssueItem item={mockIssue} />
      </Provider>,
    );
    const titleElement = getByText(mockIssue.title);
    const idElement = getByText(mockIssue.id);
    expect(titleElement).toBeDefined();
    expect(idElement).toBeDefined();
  });

  it('renders "New" tag', () => {
    const {getByText} = render(
      <Provider store={store}>
        <IssueItem item={mockIssue} />
      </Provider>,
    );
    const tagElement = getByText('New');
    expect(tagElement).toBeDefined();
  });
});
