import mongoose from 'mongoose';

async function checkDatabases() {
    try {
        await mongoose.connect('mongodb+srv://admin:Tekken%407@alif-luxury.npekzhr.mongodb.net/?appName=alif-luxury');
        const adminDb = mongoose.connection.client.db('admin').admin();
        const dbs = await adminDb.listDatabases();
        
        console.log("Databases found:");
        for (let dbInfo of dbs.databases) {
            console.log(`\nDB: ${dbInfo.name}`);
            const db = mongoose.connection.client.db(dbInfo.name);
            const cols = await db.listCollections().toArray();
            if(cols.length > 0) {
                for(let c of cols) {
                    const count = await db.collection(c.name).countDocuments();
                    console.log(`  - ${c.name}: ${count}`);
                }
            } else {
                console.log(`  (Empty)`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

checkDatabases();
