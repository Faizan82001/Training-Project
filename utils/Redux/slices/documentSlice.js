import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  editDocumentsUploaded: [],
  newDocumentsUploaded: [],
  uploadedDocumentsSources: {},
};

const documentSlice = createSlice({
  initialState,
  name: 'documents',
  reducers: {
    setNewDocumentsUploaded: (state, action) => {
      state.newDocumentsUploaded = action.payload;
    },
    setEditDocumentsUploaded: (state, action) => {
      state.editDocumentsUploaded = action.payload;
    },
  },
});

export const {setNewDocumentsUploaded, setEditDocumentsUploaded} =
  documentSlice.actions;
export default documentSlice.reducer;
