import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civic-reporting';

const issueSchema = new mongoose.Schema({
  category: String,
  status: String
});

const Issue = mongoose.model('Issue', issueSchema);

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const migrationMap = {
      'Road': 'Pothole',
      'Lighting': 'Damaged Electric Poles',
      'Water': 'Other',
      'Drainage': 'Other'
    };

    let totalUpdated = 0;
    for (const [oldCat, newCat] of Object.entries(migrationMap)) {
      const result = await Issue.updateMany(
        { category: oldCat },
        { $set: { category: newCat } }
      );
      console.log(`Migrated "${oldCat}" to "${newCat}": ${result.modifiedCount} documents updated.`);
      totalUpdated += result.modifiedCount;
    }

    console.log(`Migration complete. Total documents updated: ${totalUpdated}`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
