import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../api/api";
import axios from "axios";

export interface Components {
  id: string;
  title: string;
  details: string;
  url: string;
  preview_url: string;
  created_at: string;
}
export interface Repositories {
  id: string;
  name: string;
  description: string;
  url: string;
  preview_url: string;
  created_at: string;
}
export interface Social_Media {
  id: string;
  platform: string;
  content: string;
  url: string;
  preview_url: string;
  created_at: string;
}
export interface RecentItems {
  components: Components[];
  repositories: Repositories[];
  social_media: Social_Media[];
}
export interface itemsState {
  components: Components[];
  repositories: Repositories[];
  social_media: Social_Media[];
  recent: RecentItems;
  loading: boolean;
  error: string | null;
  //   totalPages: number;
  //   currentPage: number;
  //   totalItems: number;
}
const initialState: itemsState = {
  components: [],
  repositories: [],
  social_media: [],
  recent: {
    components: [],
    repositories: [],
    social_media: [],
  },
  loading: false,
  error: null,
  // totalPages: 1,
  // currentPage: 1,
};
export const fetchRecent = createAsyncThunk("items/fetch-recent", async () => {
  try {
    const response = await axios.get(`${API_URL}/api/recent`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});
export const fetchRepos = createAsyncThunk(
  "items/fetch-repositories",
  async () => {
    try {
      const response = await axios.get(`${API_URL}/api/repositories`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const fetchSocialMedia = createAsyncThunk(
  "items/fetch-social-media",
  async () => {
    try {
      const response = await axios.get(`${API_URL}/api/social_media`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const fetchComponents = createAsyncThunk(
  "items/fetch-components",
  async () => {
    try {
      const response = await axios.get(`${API_URL}/api/components`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null; // Can be useful for UI error handling
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComponents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComponents.fulfilled, (state, action) => {
        state.loading = false;
        state.components = action.payload;
      })
      .addCase(fetchComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch components.";
      })
      /////////////// RECENT //////////////////
      .addCase(fetchRecent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecent.fulfilled, (state, action) => {
        state.loading = false;
        state.recent = action.payload;
      })
      .addCase(fetchRecent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch recet data.";
      })
      /////////////// REPOS //////////////////
      .addCase(fetchRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepos.fulfilled, (state, action) => {
        state.loading = false;
        state.repositories = action.payload;
      })
      .addCase(fetchRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch repositories.";
      })
      ///////////////  SCIAL MEDIA  //////////////////
      .addCase(fetchSocialMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.social_media = action.payload;
      })
      .addCase(fetchSocialMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch scial media.";
      });
  },
});
export const { clearError } = itemsSlice.actions;
export default itemsSlice.reducer;
