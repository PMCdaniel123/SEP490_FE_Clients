import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export type CartItem = {
  id: string;
  name: string;
  imgUrl: string;
  price: number;
  quantity: number;
};

interface CartState {
  workspaceId: string;
  price: number;
  priceType: string;
  startTime: string;
  endTime: string;
  beverageList: CartItem[];
  amenityList: CartItem[];
  total: number;
  category: string;
}

const initialState: CartState = {
  workspaceId: "",
  price: 0,
  priceType: "1",
  startTime: "",
  endTime: "",
  beverageList: [],
  amenityList: [],
  total: 0,
  category: ""
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setWorkspaceId: (
      state,
      action: PayloadAction<{ id: string; price: number; priceType: string }>
    ) => {
      state.workspaceId = action.payload.id;
      state.price = action.payload.price;
      state.priceType = action.payload.priceType;
      cartSlice.caseReducers.calculateTotal(state);
    },
    setWorkspaceTime: (
      state,
      action: PayloadAction<{ startTime: string; endTime: string; category: string }>
    ) => {
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
      state.category = action.payload.category
      cartSlice.caseReducers.calculateTotal(state);
    },
    clearWorkspaceTime: (state) => {
      state.startTime = "";
      state.endTime = "";
      state.total = 0;
      state.category = "";
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
    clearBeverageAndAmenity: (state) => {
      state.beverageList = [];
      state.amenityList = [];
      state.total = 0;
      cartSlice.caseReducers.calculateTotal(state);
    },
    clearCart: (state) => {
      state.beverageList = [];
      state.amenityList = [];
      state.workspaceId = "";
      state.startTime = "";
      state.endTime = "";
      state.total = 0;
      cartSlice.caseReducers.calculateTotal(state);
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

      let duration = 0;

      if (state.priceType === "1") {
        const start = dayjs(state.startTime, "HH:mm DD/MM/YYYY")
          .toDate()
          .getTime();
        const end = dayjs(state.endTime, "HH:mm DD/MM/YYYY").toDate().getTime();
        duration = (end - start) / (1000 * 60 * 60);
      } else {
        const start = dayjs(state.startTime, "HH:mm DD/MM/YYYY").startOf("day");
        const end = dayjs(state.endTime, "HH:mm DD/MM/YYYY").startOf("day");
        const result = end.diff(start, "day");
        duration = result === 0 ? 1 : result;
      }

      console.log(state.price, state.priceType, duration);

      const price = state.price * duration;

      state.total = price + beverageTotal + amenityTotal;
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
  setWorkspaceTime,
  clearWorkspaceTime,
  clearBeverageAndAmenity,
} = cartSlice.actions;

export default cartSlice.reducer;
