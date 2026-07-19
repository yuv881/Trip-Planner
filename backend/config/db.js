import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const getDbUri = (dbName) => {
    const defaultURI = 'mongodb://localhost:27017';
    const uri = process.env.MONGO_URI || defaultURI;
    
    const protocolEnd = uri.indexOf('://') + 3;
    const lastSlash = uri.indexOf('/', protocolEnd);
    
    if (lastSlash === -1) {
        return `${uri}/${dbName}`;
    } else {
        const pathAndQuery = uri.slice(lastSlash);
        const questionMark = pathAndQuery.indexOf('?');
        if (questionMark === -1) {
            return `${uri.slice(0, lastSlash)}/${dbName}`;
        } else {
            const query = pathAndQuery.slice(questionMark);
            return `${uri.slice(0, lastSlash)}/${dbName}${query}`;
        }
    }
};

const userDbUri = getDbUri('Trip_Planner');
const tripDbUri = getDbUri('Trips');

console.log(`Connecting User DB to: ${userDbUri.replace(/:([^:@]+)@/, ':****@')}`);
console.log(`Connecting Trips DB to: ${tripDbUri.replace(/:([^:@]+)@/, ':****@')}`);

export const userConnection = mongoose.createConnection(userDbUri);
export const tripConnection = mongoose.createConnection(tripDbUri);

userConnection.on('connected', () => console.log('MongoDB: Connected to User Database (Trip_Planner)'));
userConnection.on('error', (err) => console.error(`MongoDB User DB connection error: ${err.message}`));

tripConnection.on('connected', () => console.log('MongoDB: Connected to Trips Database (Trips)'));
tripConnection.on('error', (err) => console.error(`MongoDB Trips DB connection error: ${err.message}`));

const connectDB = async () => {
    // Both connections are created automatically, but this helps verify status on startup
    return { userConnection, tripConnection };
};

export default connectDB;
