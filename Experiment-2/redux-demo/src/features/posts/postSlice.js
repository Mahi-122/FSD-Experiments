import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const postSlice = createSlice({
  name: "posts",

  initialState,

  reducers: {
    addPost: (state, action) => {
      state.items.push(action.payload);
    },

    updatePost: (state, action) => {
      const { id, content } = action.payload;

      const post = state.items.find((post) => post.id === id);

      if (post) {
        post.content = content;
      }
    },

    deletePost: (state, action) => {
      state.items = state.items.filter(
        (post) => post.id !== action.payload
      );
    },
  },
});

export const {
  addPost,
  updatePost,
  deletePost,
} = postSlice.actions;

export default postSlice.reducer;