import firestore from '@react-native-firebase/firestore';
import showToast from '../toast';

export const fetchNextPage = (
  startAt,
  tripList,
  setStartAt,
  setNotificationList,
) => {
  tripList.forEach(async runNo => {
    try {
      const querySnapshot = await firestore()
        .collection(runNo)
        .orderBy('timestamp', 'desc')
        .startAfter(startAt)
        .limit(10)
        .get();

      const updatedData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: `${doc.id}-${doc.runNo}`,
        runNo,
      }));
      if (!querySnapshot.empty) {
        const lastDocumentSnapshot =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        setStartAt(lastDocumentSnapshot);
      }

      setNotificationList(prevData => {
        const newData = [...prevData, ...updatedData];
        const filteredList = newData.filter(
          (item, index, self) =>
            index === self.findIndex(t => t.id === item.id),
        );
        return filteredList.sort((a, b) => b.timestamp - a.timestamp);
      });
    } catch (error) {
      showToast('Error fetching next page');
    }
  });
};
