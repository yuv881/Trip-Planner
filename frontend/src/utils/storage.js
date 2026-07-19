const getAuthHeaders = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return {};
    try {
        const user = JSON.parse(userStr);
        if (!user || !user.username) return {};
        return {
            'Content-Type': 'application/json',
            'x-user-username': user.username
        };
    } catch (e) {
        return {};
    }
};

export const getTrips = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/trips', {
            headers: getAuthHeaders()
        });
        if (!res.ok) {
            throw new Error('Failed to fetch trips');
        }
        return await res.json();
    } catch (error) {
        console.error('Error in getTrips:', error);
        return [];
    }
};

export const getTripById = async (id) => {
    try {
        const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) {
            throw new Error('Failed to fetch trip details');
        }
        return await res.json();
    } catch (error) {
        console.error(`Error in getTripById for ${id}:`, error);
        return null;
    }
};

export const saveTrip = async (newTrip) => {
    try {
        const res = await fetch('http://localhost:5000/api/trips', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(newTrip)
        });
        if (!res.ok) {
            throw new Error('Failed to save trip');
        }
        return await res.json();
    } catch (error) {
        console.error('Error in saveTrip:', error);
        return null;
    }
};
