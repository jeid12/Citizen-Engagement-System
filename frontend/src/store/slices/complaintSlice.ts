import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  category: {
    id: string;
    name: string;
  };
  agency?: {
    id: string;
    name: string;
  };
  location?: string;
  attachments?: string[];
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
    setSelectedComplaint: (state, action: PayloadAction<Complaint>) => {
      state.selectedComplaint = action.payload;
    },
    clearSelectedComplaint: (state) => {
      state.selectedComplaint = null;
    },
    addComplaint: (state, action: PayloadAction<Complaint>) => {
      state.complaints.unshift(action.payload);
    },
    updateComplaintStatus: (state, action: PayloadAction<{ id: string; status: Complaint['status'] }>) => {
      const complaint = state.complaints.find(c => c.id === action.payload.id);
      if (complaint) {
        complaint.status = action.payload.status;
      }
    },
  },
});

export const {
  fetchComplaintsStart,
  fetchComplaintsSuccess,
  fetchComplaintsFailure,
  setSelectedComplaint,
  clearSelectedComplaint,
  addComplaint,
  updateComplaintStatus,
} = complaintSlice.actions;

export default complaintSlice.reducer; 