import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isTablet: false,
};

const dimensionSlice = createSlice({
  initialState,
  name: 'isTablet',
  reducers: {
    setIsTablet: (state, action) => {
      state.isTablet = action.payload;
    },
  },
});

export const {setIsTablet} = dimensionSlice.actions;
export default dimensionSlice.reducer;
