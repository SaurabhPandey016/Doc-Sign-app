import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Safely pull PrismaClient from the default module bundle to satisfy Node 24 ESM rules
import prismaPkg from '@prisma/client';
const { PrismaClient } = prismaPkg;

const { Pool } = pg;

// Initialize the native PostgreSQL connection pooling instance
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Bind the active transaction adapter into the primary Prisma instance lifecycle
const prisma = new PrismaClient({ adapter });

export default prisma;