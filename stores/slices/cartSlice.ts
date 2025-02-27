import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

interface CartState {
  workspaceId: string;
  beverageList: CartItem[];
  amenityList: CartItem[];
}

const initialState: CartState = {
  workspaceId: "",
  beverageList: [],
  amenityList: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setWorkspaceId: (state, action: PayloadAction<string>) => {
      state.workspaceId = action.payload;
    },
    addBeverage: (state, action: PayloadAction<CartItem>) => {
      state.beverageList.push(action.payload);
    },
    removeBeverage: (state, action: PayloadAction<string>) => {
      state.beverageList = state.beverageList.filter(
        (item) => item.id !== action.payload
      );
    },
    addAmenity: (state, action: PayloadAction<CartItem>) => {
      state.amenityList.push(action.payload);
    },
    removeAmenity: (state, action: PayloadAction<string>) => {
      state.amenityList = state.amenityList.filter(
        (item) => item.id !== action.payload
      );
    },
    updateAmenityQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.amenityList.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    updateBeverageQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.beverageList.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.beverageList = [];
      state.amenityList = [];
    },
  },
});

export const {
  setWorkspaceId,
  addBeverage,
  removeBeverage,
  updateBeverageQuantity,
  addAmenity,
  removeAmenity,
  updateAmenityQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
