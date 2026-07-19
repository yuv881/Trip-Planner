import mongoose from 'mongoose';
import { tripConnection } from '../config/db.js';

const budgetBreakdownSchema = new mongoose.Schema({
    category: { type: String, required: true },
    amount: { type: Number, default: 0 }
}, { _id: false });

const travelerSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String, required: true },
    role: { type: String, default: 'member' }
}, { _id: false });

const flightDetailsSchema = new mongoose.Schema({
    airline: { type: String, default: '' },
    flightNumber: { type: String, default: '' },
    from: { type: String, default: '' },
    to: { type: String, default: '' },
    departure: { type: String, default: '' }
}, { _id: false });

const accommodationSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    checkIn: { type: String, default: null },
    checkOut: { type: String, default: null }
}, { _id: false });

const itineraryItemSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    location: { type: String, default: '' },
    budget: { type: Number, default: 0 },
    description: { type: String, default: '' },
    status: { type: String, default: 'pending' }
}, { _id: false });

const taskSchema = new mongoose.Schema({
    id: { type: String },
    title: { type: String, required: true },
    done: { type: Boolean, default: false }
}, { _id: false });

const tripSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true,
        default: 'Unnamed Trip'
    },
    coverImage: {
        type: String,
        default: ""
    },
    startDate: {
        type: String,
        default: 'TBD'
    },
    endDate: {
        type: String,
        default: 'TBD'
    },
    durationDays: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['planning', 'in_progress', 'completed', 'not_started'],
        default: 'planning'
    },
    budget: {
        total: { type: Number, default: 0 },
        currency: { type: String, default: 'INR' },
        spent: { type: Number, default: 0 },
        breakdown: [budgetBreakdownSchema]
    },
    travelers: [travelerSchema],
    travelDetails: {
        transportMode: { type: String, default: 'flight' },
        outboundFlight: { type: flightDetailsSchema, default: null },
        returnFlight: { type: flightDetailsSchema, default: null },
        accommodation: { type: accommodationSchema, default: null },
        documents: {
            idProofValid: { type: Boolean, default: true },
            visaRequired: { type: Boolean, default: false },
            travelInsurance: { type: Boolean, default: false }
        },
        emergencyContact: {
            name: { type: String, default: '' },
            phone: { type: String, default: '' }
        },
        localInfo: {
            currency: { type: String, default: 'INR' },
            timeZone: { type: String, default: 'IST (UTC+5:30)' },
            language: { type: String, default: 'Hindi, English' }
        }
    },
    itinerary: [itineraryItemSchema],
    tasks: [taskSchema]
}, {
    timestamps: true
});

export const getTripModel = (username) => {
    if (!username) {
        throw new Error("Username is required to get a trip model connection");
    }
    const collectionName = username.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    
    if (tripConnection.models[collectionName]) {
        return tripConnection.models[collectionName];
    }
    return tripConnection.model(collectionName, tripSchema, collectionName);
};

export default getTripModel;
