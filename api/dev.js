import app from './index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure we load the right .env
dotenv.config({ path: join(__dirname, '../.env') });

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[Express Dev] Serverless Mock API listening at http://localhost:${port}`);
});
