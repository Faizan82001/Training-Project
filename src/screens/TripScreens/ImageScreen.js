import {Image} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setLoading} from '../../../utils/Redux/slices/loadingSlice';
import store from '../../../utils/Redux/store';
import showToast from '../../../utils/toast';

const ImageScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    store.dispatch(setLoading(true));
  }, []);

  const {title} = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({title});
  }, [navigation, title]);

  return (
    <Image
      testID="image-screen"
      resizeMode="contain"
      style={{height: '100%', width: '100%'}}
      source={{uri: route.params.imageUrl}}
      onLoad={() => {
        dispatch(setLoading(false));
      }}
      onError={error => {
        dispatch(setLoading(false));
        showToast('Something went wrong try loading image again');
      }}
    />
  );
};

export default ImageScreen;
