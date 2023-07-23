import {TRIP_NOTIFICATION} from '../src/constants/constants';

export const messageHelper = (status, runNo) => {
  switch (status) {
    case TRIP_NOTIFICATION.NEW_REQUEST:
      return `New Request has been created with Run No. ${runNo}`;
    case TRIP_NOTIFICATION.ASSIGNED_REQUEST:
      return `Request with Run No. ${runNo} has been Assigned for Review`;
    case TRIP_NOTIFICATION.REQUEST_MORE_INFO:
      return `Request with Run No. ${runNo} Requires more information`;
    case TRIP_NOTIFICATION.DATA_PROVIDED:
      return `Request with Run No. ${runNo} has been submitted again for Approval`;
    case TRIP_NOTIFICATION.APPROVED_REQUEST:
      return `Request with Run No. ${runNo} has been Approved`;
    case TRIP_NOTIFICATION.APPROVED_WITH_EXCEPTION:
      return `Request with Run No. ${runNo} has been Approved with Exception`;
    case TRIP_NOTIFICATION.UNASSIGNED_REQUEST:
      return `Request with Run No. ${runNo} has been Unassigned`;
    case TRIP_NOTIFICATION.NEW_COMMENT:
      return `Request with Run No. ${runNo} has a New Comment`;
    default:
      return '';
  }
};
