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
  workspacePrice: number;
  beverageList: CartItem[];
  amenityList: CartItem[];
  total: number;
}

const initialState: CartState = {
  workspaceId: "",
  workspacePrice: 0,
  beverageList: [],
  amenityList: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setWorkspaceId: (
      state,
      action: PayloadAction<{ id: string; price: number }>
    ) => {
      state.workspaceId = action.payload.id;
      state.workspacePrice = action.payload.price;
      cartSlice.caseReducers.calculateTotal(state);
    },
    addBeverage: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.beverageList.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.beverageList.push(action.payload);
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    removeBeverage: (state, action: PayloadAction<string>) => {
      state.beverageList = state.beverageList.filter(
        (item) => item.id !== action.payload
      );
      cartSlice.caseReducers.calculateTotal(state);
    },
    updateBeverageQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.beverageList.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    addAmenity: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.amenityList.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.amenityList.push(action.payload);
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    removeAmenity: (state, action: PayloadAction<string>) => {
      state.amenityList = state.amenityList.filter(
        (item) => item.id !== action.payload
      );
      cartSlice.caseReducers.calculateTotal(state);
    },
    updateAmenityQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.amenityList.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    clearCart: (state) => {
      state.beverageList = [];
      state.amenityList = [];
      state.workspaceId = "";
      state.workspacePrice = 0;
      state.total = 0;
    },
    calculateTotal: (state) => {
      const beverageTotal = state.beverageList.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const amenityTotal = state.amenityList.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      state.total = state.workspacePrice + beverageTotal + amenityTotal;
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
  calculateTotal,
} = cartSlice.actions;

export default cartSlice.reducer;