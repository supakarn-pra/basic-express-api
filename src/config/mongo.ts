import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || '';

if (!mongoUri) {
  console.warn('Warning: MongoDB URI not found in environment variables');
}

// Enable strict query mode for Mongoose 7
mongoose.set('strictQuery', true);

// Connection events
mongoose.connection.on('connected', () => {
  console.log('✓ MongoDB connected successfully');});

mongoose.connection.on('error', (err: any) => {
  console.error('MongoDB connection error:', err);
});

export const connectMongo = async (): Promise<boolean> => {
  try {
    await mongoose.connect(mongoUri);
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return false;
  }
};

export const disconnectMongo = async (): Promise<void> => {
  await mongoose.disconnect();
};
