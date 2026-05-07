import API from '../api/axios';

export const submitInquiry = (data) => {
    return API.post('/inquiries', data);
};

export const getAllInquiries = () => {
    return API.get('/inquiries');
};

export const updateInquiryStatus = (id, status) => {
    return API.patch(`/inquiries/${id}/status`, { status });
};
