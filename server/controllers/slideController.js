import Slide from '../models/Slide.js';

export const getSlides = async (req, res) => {
    try {
        const slides = await Slide.find().sort({ order: 1 });
        res.status(200).json(slides);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slides', error: error.message });
    }
};

export const createSlide = async (req, res) => {
    try {
        // Automatically assign the next order number
        const count = await Slide.countDocuments();
        const newSlide = new Slide({ ...req.body, order: count });
        const savedSlide = await newSlide.save();
        res.status(201).json(savedSlide);
    } catch (error) {
        res.status(400).json({ message: 'Error creating slide', error: error.message });
    }
};

export const updateSlide = async (req, res) => {
    try {
        const updatedSlide = await Slide.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSlide) return res.status(404).json({ message: 'Slide not found' });
        res.status(200).json(updatedSlide);
    } catch (error) {
        res.status(400).json({ message: 'Error updating slide', error: error.message });
    }
};

export const deleteSlide = async (req, res) => {
    try {
        const deletedSlide = await Slide.findByIdAndDelete(req.params.id);
        if (!deletedSlide) return res.status(404).json({ message: 'Slide not found' });
        res.status(200).json({ message: 'Slide deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting slide', error: error.message });
    }
};

export const updateSlideOrder = async (req, res) => {
    try {
        const { slides } = req.body; 
        const bulkOps = slides.map(slide => ({
            updateOne: {
                filter: { _id: slide.id },
                update: { order: slide.order }
            }
        }));
        await Slide.bulkWrite(bulkOps);
        res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};
