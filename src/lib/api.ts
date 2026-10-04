// src/lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function fetchAPI(endpoint: string, method = 'GET', body: any = null) {
    let token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const makeRequest = async (currentToken: string | null) => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (currentToken) {
            headers['Authorization'] = `Bearer ${currentToken}`;
        }

        const config: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        return fetch(`${API_BASE}${endpoint}`, config);
    };

    let response = await makeRequest(token);

    if (response.status === 401) {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

        if (refreshToken) {
            try {
                const refreshRes = await fetch(`${API_BASE}/token/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    
                    // Naya access token save karein
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('access_token', refreshData.access);
                    }
                    
                    response = await makeRequest(refreshData.access);
                } else {
                    // Agar refresh token bhi expire ho gaya hai, toh logout kar dein
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = '/login';
                    }
                    throw new Error('Session expired. Please login again.');
                }
            } catch (error) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
                throw new Error('Session expired. Please login again.');
            }
        } else {
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw new Error('Authentication required.');
        }
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || data.message || 'Something went wrong. Please try again. ');
    }
    
    return data;
}