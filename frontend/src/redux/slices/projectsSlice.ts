import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../api/api";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type Project = {
  id: string;
  label: string;
  project_name: string;
  bg: string;
  accent: string;
  desktop_x?: number;
  desktop_y?: number;
  mobile_x?: number;
  mobile_y?: number;
  created_at: string;
  updated_at: string;
};

export interface ProjectsState {
  projects: Project[];
  selectedProjectId: string | null;
  loading: boolean;
  error: string | null;
}

/* ─── Thunk ──────────────────────────────────────────────────────────────── */

export const fetchProjects = createAsyncThunk<
  Project[],          // fulfilled payload
  void,               // no argument needed
  { rejectValue: string }
>("projects/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/projects`);

    if (!res.ok) {
      return rejectWithValue(
        `Failed to fetch projects: ${res.status} ${res.statusText}`
      );
    }

    const data: Project[] = await res.json();
    return data;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error"
    );
  }
});

/* ─── Initial state ──────────────────────────────────────────────────────── */

const initialState: ProjectsState = {
  projects: [],
  selectedProjectId: null,
  loading: false,
  error: null,
};

/* ─── Slice ──────────────────────────────────────────────────────────────── */

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.id
      );
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    },
    selectProject: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch projects";
      });
  },
});

/* ─── Exports ────────────────────────────────────────────────────────────── */

export const {
  setProjects,
  addProject,
  updateProject,
  removeProject,
  selectProject,
} = projectsSlice.actions;

export default projectsSlice.reducer;