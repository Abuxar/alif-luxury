export const API_URL = '/api';

export const fetchProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
};
