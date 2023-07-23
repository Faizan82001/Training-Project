import {render} from '@testing-library/react-native';
import setImage from '../../utils/controllers/setImageController';
import {TRIP_NOTIFICATION} from '../../src/constants/constants';

describe('setImage', () => {
  test('returns the correct image component for APPROVED_REQUEST and device type', () => {
    const title = TRIP_NOTIFICATION.APPROVED_REQUEST;
    const isTablet = false;

    const {getByTestId} = render(setImage(title, isTablet));

    const imageComponent = getByTestId('notification-image');
    expect(imageComponent.props.source).toEqual(
      require('../../assets/images/approved.png'),
    );
  });

  test('returns the correct image component for REQUEST_MORE_INFO and device type', () => {
    const title = TRIP_NOTIFICATION.REQUEST_MORE_INFO;
    const isTablet = false;

    const {getByTestId} = render(setImage(title, isTablet));

    const imageComponent = getByTestId('notification-image');
    expect(imageComponent.props.source).toEqual(
      require('../../assets/images/info.png'),
    );
  });

  test('returns the correct image component for APPROVED_WITH_EXCEPTION and device type', () => {
    const title = TRIP_NOTIFICATION.APPROVED_WITH_EXCEPTION;
    const isTablet = false;

    const {getByTestId} = render(setImage(title, isTablet));

    const imageComponent = getByTestId('notification-image');
    expect(imageComponent.props.source).toEqual(
      require('../../assets/images/info.png'),
    );
  });

  test('returns the correct image component for UNASSIGNED_REQUEST and device type', () => {
    const title = TRIP_NOTIFICATION.UNASSIGNED_REQUEST;
    const isTablet = false;

    const {getByTestId} = render(setImage(title, isTablet));

    const imageComponent = getByTestId('notification-image');
    expect(imageComponent.props.source).toEqual(
      require('../../assets/images/info.png'),
    );
  });

  test('returns the correct image component for NEW_COMMENT and device type', () => {
    const title = TRIP_NOTIFICATION.NEW_COMMENT;
    const isTablet = false;

    const {getByTestId} = render(setImage(title, isTablet));

    const imageComponent = getByTestId('notification-image');
    expect(imageComponent.props.source).toEqual(
      require('../../assets/images/info.png'),
    );
  });

  test('returns the correct image component for DATA_PROVIDED and device type', () => {
    const title = TRIP_NOTIFICATION.DATA_PROVIDED;
    const isTablet = false;

    const {getByTestId} = render(setImage(title, isTablet));

    const imageComponent = getByTestId('notification-image');
    expect(imageComponent.props.source).toEqual(
      require('../../assets/images/info.png'),
    );
  });

  test('returns the correct image component for ASSIGNED_REQUEST and device type', () => {
    const title = TRIP_NOTIFICATION.ASSIGNED_REQUEST;
    const isTablet = false;

    const {getByTestId} = render(setImage(title, isTablet));

    const imageComponent = getByTestId('notification-image');
    expect(imageComponent.props.source).toEqual(
      require('../../assets/images/info.png'),
    );
  });

  test('returns the correct image component for ASSIGNED_REQUEST and device type is tablet', () => {
    const title = TRIP_NOTIFICATION.ASSIGNED_REQUEST;
    const isTablet = true;

    const {getByTestId} = render(setImage(title, isTablet));

    const imageComponent = getByTestId('notification-image');
    expect(imageComponent.props.source).toEqual(
      require('../../assets/images/info.png'),
    );
  });
});
