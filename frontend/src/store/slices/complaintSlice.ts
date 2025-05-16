import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  location: string;
  category: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface ComplaintState {
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  loading: boolean;
  error: string | null;
}

const initialState: ComplaintState = {
  complaints: [],
  selectedComplaint: null,
  loading: false,
  error: null,
};

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    fetchComplaintsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchComplaintsSuccess: (state, action: PayloadAction<Complaint[]>) => {
      state.loading = false;
      state.complaints = action.payload;
    },
    fetchComplaintsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectComplaint: (state, action: PayloadAction<Complaint>) => {
      state.selectedComplaint = action.payload;
    },
    clearSelectedComplaint: (state) => {
      state.selectedComplaint = null;
    },
    addComplaint: (state, action: PayloadAction<Complaint>) => {
      state.complaints.unshift(action.payload);
    },
    updateComplaint: (state, action: PayloadAction<Complaint>) => {
      const index = state.complaints.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.complaints[index] = action.payload;
      }
    },
    deleteComplaint: (state, action: PayloadAction<string>) => {
      state.complaints = state.complaints.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  fetchComplaintsStart,
  fetchComplaintsSuccess,
  fetchComplaintsFailure,
  selectComplaint,
  clearSelectedComplaint,
  addComplaint,
  updateComplaint,
  deleteComplaint,
} = complaintSlice.actions;

export default complaintSlice.reducer; 