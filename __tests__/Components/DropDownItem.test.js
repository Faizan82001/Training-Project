import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import DropDownItem from '../../src/components/DropDownItem';
import {Provider} from 'react-redux';
import store from '../../utils/Redux/store';
import {setIsTablet} from '../../utils/Redux/slices/dimensionSlice';

jest.mock('../../utils/toast.js', () => jest.fn());
jest.mock('react-native-root-toast', () => ({
  durations: {
    LONG: 'long',
  },
}));

describe('DropDownItem', () => {
  it('should call handleOptionsPressed when option is selected', () => {
    const mockItems = ['ALS'];
    const mockHandleOptionsPressed = jest.fn();
    const screen = render(
      <Provider store={store}>
        <DropDownItem
          item={mockItems}
          handleOptionPress={mockHandleOptionsPressed}
        />
      </Provider>,
    );
    const modalTouch = screen.getByTestId('modal-touch');
    fireEvent.press(modalTouch);
    expect(mockHandleOptionsPressed).toHaveBeenCalled();
  });

  it('should call handleOptionsPressed when option is selected in tablet mode', () => {
    const mockItems = ['ALS'];
    const mockHandleOptionsPressed = jest.fn();
    store.dispatch(setIsTablet(true));
    const screen = render(
      <Provider store={store}>
        <DropDownItem
          item={mockItems}
          handleOptionPress={mockHandleOptionsPressed}
        />
      </Provider>,
    );
    const modalTouch = screen.getByTestId('modal-touch');
    fireEvent.press(modalTouch);
    expect(mockHandleOptionsPressed).toHaveBeenCalled();
  });
});
