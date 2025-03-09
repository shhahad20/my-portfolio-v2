import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../api/api";
import axios from "axios";

export interface Components {
  id: string;
  title: string;
  details: string;
  label: string;
  url: string;
  preview_url: string;
  created_at: string;
}
export interface Repositories {
  id: string;
  name: string;
  description: string;
  label: string;
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
export const fetchRecent = createAsyncThunk(
  "items/fetch-recent",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/recent`);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching recent data"
      );
    }
  }
);

export const fetchRepos = createAsyncThunk(
  "items/fetch-repositories",
  async (    {
    search,
    sortField,
    sortOrder,
    limit,
  }: {
    search?: string;
    sortField?: string;
    sortOrder?: string;
    limit?: number;
  },
  thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (sortField) params.append("sortField", sortField);
      if (sortOrder) params.append("sortOrder", sortOrder);
      if (limit) params.append("limit", limit.toString());
      const queryString = params.toString();

      const response = await axios.get(`${API_URL}/repositories${queryString ? "?" + queryString : ""}`);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch repositories."
      );
    }
  }
);

export const fetchSocialMedia = createAsyncThunk(
  "items/fetch-social-media",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/api/social_media`);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch social media."
      );
    }
  }
);

export const fetchComponents = createAsyncThunk(
  "items/fetch-components",
  async (
    {
      search,
      sortField,
      sortOrder,
      limit,
    }: {
      search?: string;
      sortField?: string;
      sortOrder?: string;
      limit?: number;
    },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (sortField) params.append("sortField", sortField);
      if (sortOrder) params.append("sortOrder", sortOrder);
      if (limit) params.append("limit", limit.toString());
      const queryString = params.toString();
      
      const response = await axios.get(`${API_URL}/components${queryString ? "?" + queryString : ""}`);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch components."
      );
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
