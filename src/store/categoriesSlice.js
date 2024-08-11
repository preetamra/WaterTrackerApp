import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
  enabledValues: [],
  todaysTransactions: [],
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: initialState,
  reducers: {
    allCategoriesList: (state, action) => {
      state.value = action.payload;
    },
    allEnabledCategoriesList: (state, action) => {
      state.enabledValues = action.payload;
    },
    todaysTransactions: (state, action) => {
      state.todaysTransactions = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const categoryActions = categoriesSlice.actions;

export default categoriesSlice.reducer