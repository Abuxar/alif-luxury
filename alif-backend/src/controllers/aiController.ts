import { Request, Response } from 'express';
import Product from '../models/Product';

export const processChat = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        const lowerQuery = message.toLowerCase();
        let matchedProducts = [];
        let responseText = "";

        // Heuristics Engine matching real DB Products
        if (lowerQuery.includes('wedding') || lowerQuery.includes('bridal') || lowerQuery.includes('formal') || lowerQuery.includes('evening')) {
            matchedProducts = await Product.find({
                $or: [
                    { occasionTags: { $regex: 'formal', $options: 'i' } },
                    { description: { $regex: 'luxury', $options: 'i' } },
                    { price: { $gt: 15000 } }
                ]
            }).limit(2);
            responseText = "For elevated evening wear and formal occasions, I recommend exploring our Luxury Formal collection. The intricate hand-embellishments and premium fabrics in these pieces are designed to make a statement.";
        } 
        else if (lowerQuery.includes('casual') || lowerQuery.includes('daily') || lowerQuery.includes('summer') || lowerQuery.includes('lawn')) {
            matchedProducts = await Product.find({
                $or: [
                    { occasionTags: { $regex: 'casual', $options: 'i' } },
                    { title: { $regex: 'prêt', $options: 'i' } },
                    { title: { $regex: 'unstitched', $options: 'i' } },
                    { price: { $lte: 10000 } }
                ]
            }).limit(2);
            responseText = "For effortless daily elegance, our Prêt and lighter Unstitched fabrics are perfect. They offer breathable luxury without compromising on our signature aesthetic.";
        }
        else if (lowerQuery.includes('black') || lowerQuery.includes('dark')) {
            matchedProducts = await Product.find({
                $or: [
                    { colorFamily: { $regex: 'black', $options: 'i' } },
                    { title: { $regex: 'obsidian', $options: 'i' } },
                    { title: { $regex: 'midnight', $options: 'i' } }
                ]
            }).limit(2);
            responseText = "Black represents timeless sophistication. I've curated a selection of our darkest, most dramatic pieces tailored to the Midnight Luxe aesthetic.";
        }
        else {
            // General Fallback
            matchedProducts = await Product.aggregate([{ $sample: { size: 2 } }]);
            responseText = "Based on your preferences, I've selected a few pieces from our archives that I believe align with your aesthetic vision. Would you like to refine the selection further?";
        }

        // Feature expansion ready: If OPENAI_API_KEY is present, we could overwrite `responseText` by calling the OpenAI API here.
        // For now, return the heuristic results.

        res.json({
            text: responseText,
            products: matchedProducts
        });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ error: 'Failed to process AI chat' });
    }
};
