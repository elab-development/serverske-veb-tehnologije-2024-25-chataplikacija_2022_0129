import api from '../api';

export interface GiphyImage {
    url: string;
    width: string;
    height: string;
}

export interface GiphyGif {
    id: string;
    title: string;
    images: {
        original: GiphyImage;
        fixed_height: GiphyImage;
        fixed_width: GiphyImage;
        preview_gif: GiphyImage;
    };
    url: string;
}

export interface GiphyResponse {
    data: GiphyGif[];
    pagination: {
        total_count: number;
        count: number;
        offset: number;
    };
}

export const giphyService = {
    search: async (query: string, limit = 25, offset = 0): Promise<GiphyResponse> => {
        const response = await api.get<GiphyResponse>('/giphy/search', {
            params: { query, limit, offset }
        });
        return response.data;
    },

    trending: async (limit = 25, offset = 0): Promise<GiphyResponse> => {
        const response = await api.get<GiphyResponse>('/giphy/trending', {
            params: { limit, offset }
        });
        return response.data;
    },

    getById: async (id: string): Promise<{ data: GiphyGif }> => {
        const response = await api.get<{ data: GiphyGif }>(`/giphy/${id}`);
        return response.data;
    }
};