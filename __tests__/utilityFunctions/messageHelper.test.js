import {messageHelper} from '../../utils/messageHelper';
import {TRIP_NOTIFICATION} from '../../src/constants/constants';

describe('messageHelper', () => {
  it('should return the correct message for each status', () => {
    const runNo = '55';

    expect(messageHelper(TRIP_NOTIFICATION.NEW_REQUEST, runNo)).toBe(
      'New Request has been created with Run No. 55',
    );
    expect(messageHelper(TRIP_NOTIFICATION.ASSIGNED_REQUEST, runNo)).toBe(
      'Request with Run No. 55 has been Assigned for Review',
    );
    expect(messageHelper(TRIP_NOTIFICATION.REQUEST_MORE_INFO, runNo)).toBe(
      'Request with Run No. 55 Requires more information',
    );
    expect(messageHelper(TRIP_NOTIFICATION.DATA_PROVIDED, runNo)).toBe(
      'Request with Run No. 55 has been submitted again for Approval',
    );
    expect(messageHelper(TRIP_NOTIFICATION.APPROVED_REQUEST, runNo)).toBe(
      'Request with Run No. 55 has been Approved',
    );
    expect(
      messageHelper(TRIP_NOTIFICATION.APPROVED_WITH_EXCEPTION, runNo),
    ).toBe('Request with Run No. 55 has been Approved with Exception');
    expect(messageHelper(TRIP_NOTIFICATION.UNASSIGNED_REQUEST, runNo)).toBe(
      'Request with Run No. 55 has been Unassigned',
    );
    expect(messageHelper(TRIP_NOTIFICATION.NEW_COMMENT, runNo)).toBe(
      'Request with Run No. 55 has a New Comment',
    );
    expect(messageHelper('unknown status', runNo)).toBe('');
  });
});
