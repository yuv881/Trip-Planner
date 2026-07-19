import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { getTrips, getTripById, createTrip, updateTrip, deleteTrip } from '../controllers/tripController.js';

const router = express.Router();

// Multer memory storage config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary upload route
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'trip_planner' },
                (error, uploadResult) => {
                    if (error) reject(error);
                    else resolve(uploadResult);
                }
            );
            stream.write(req.file.buffer);
            stream.end();
        });

        res.json({ url: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/')
    .get(getTrips)
    .post(createTrip);

router.route('/:id')
    .get(getTripById)
    .put(updateTrip)
    .delete(deleteTrip);

export default router;
