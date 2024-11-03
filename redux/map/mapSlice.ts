import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MapState {
  region: any;
}

const initialState: MapState = {
  region: {},
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    mapSearch: (state, action: PayloadAction<any>) => {
      state.region = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { mapSearch } = mapSlice.actions;

export default mapSlice.reducer;
