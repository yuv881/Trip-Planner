import { getTripModel } from '../models/Trip.js';

// Get all trips
export const getTrips = async (req, res) => {
    try {
        const username = req.headers['x-user-username'];
        if (!username) {
            return res.status(400).json({ message: 'Header x-user-username is required' });
        }
        const Trip = getTripModel(username);
        const trips = await Trip.find({}).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get trip by ID
export const getTripById = async (req, res) => {
    try {
        const username = req.headers['x-user-username'];
        if (!username) {
            return res.status(400).json({ message: 'Header x-user-username is required' });
        }
        const Trip = getTripModel(username);
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new trip
export const createTrip = async (req, res) => {
    try {
        const username = req.headers['x-user-username'];
        if (!username) {
            return res.status(400).json({ message: 'Header x-user-username is required' });
        }
        const Trip = getTripModel(username);
        const trip = new Trip(req.body);
        const savedTrip = await trip.save();
        res.status(201).json(savedTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update existing trip
export const updateTrip = async (req, res) => {
    try {
        const username = req.headers['x-user-username'];
        if (!username) {
            return res.status(400).json({ message: 'Header x-user-username is required' });
        }
        const Trip = getTripModel(username);
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a trip
export const deleteTrip = async (req, res) => {
    try {
        const username = req.headers['x-user-username'];
        if (!username) {
            return res.status(400).json({ message: 'Header x-user-username is required' });
        }
        const Trip = getTripModel(username);
        const trip = await Trip.findByIdAndDelete(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
