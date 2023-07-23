import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  serviceLevelList: [],
};

const serviceLevelSlice = createSlice({
  initialState,
  name: 'services',
  reducers: {
    setServiceList: (state, action) => {
      state.serviceLevelList = action.payload;
    },
  },
});

export const {setServiceList} = serviceLevelSlice.actions;
export default serviceLevelSlice.reducer;
