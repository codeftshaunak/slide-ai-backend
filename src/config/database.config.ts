// database.config.ts
import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const databaseConfig: MongooseModuleOptions = {
  uri: process.env.DATABASE_URL, // Assuming DATABASE_URL is set in .env file
  autoIndex: process.env.NODE_ENV !== 'production', // Disable indexing in production for performance
};
