import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // ProductCard.jsx bunu çağırır
      const incoming = action.payload;
      const found = state.items.find((i) => i._id === incoming._id);

      if (found) {
        found.quantity += 1;
      } else {
        state.items.push({
          ...incoming,
          quantity: 1,
        });
      }
    },

    addItem: (state, action) => {
      // Alternativ funksiya - lazım olsa
      const incoming = action.payload;
      const found = state.items.find((i) => i._id === incoming._id);
      if (found) {
        found.quantity += incoming.quantity || 1;
      } else {
        state.items.push({
          ...incoming,
          quantity: incoming.quantity || 1,
        });
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) {
        if (item.quantity > 1) item.quantity -= 1;
        else state.items = state.items.filter((i) => i._id !== action.payload);
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  addItem,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
