import api from './api';

export interface ReviewRequest {
  reviewer_name: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const reviewService = {
  getReviews: async (): Promise<ReviewResponse[]> => {
    const response = await api.get('/reviews');
    return response.data;
  },

  createReview: async (data: ReviewRequest): Promise<{ message: string }> => {
    const response = await api.post('/reviews', data);
    return response.data;
  }
};
