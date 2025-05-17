import axios from '../axios';

interface ProfileData {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    bio?: string;
    address?: string;
    city?: string;
    country?: string;
}

const profileAPI = {
    getProfile: () => axios.get('/profile'),
    updateProfile: (data: ProfileData) => axios.put('/profile', data),
    uploadPhoto: (file: File) => {
        const formData = new FormData();
        formData.append('photo', file);
        return axios.post('/profile/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default profileAPI; 