import "server-only";
import { MongoClient, type Db } from "mongodb";

/**
 * One MongoClient for the whole process. Next's dev server re-evaluates modules
 * on every edit, so the client is parked on globalThis — otherwise each save
 * would open another connection pool until Atlas refuses them.
 */
const uri = process.env.MONGODB_URI;

declare global {
  var __timeHouseMongo: Promise<MongoClient> | undefined;
}

function connect(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local — see .env.example for the shape.",
    );
  }
  return new MongoClient(uri, {
    // The admin panel is write-light and read-heavy; a small pool is plenty and
    // keeps us well inside the free-tier connection limit.
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10_000,
  }).connect();
}

function getClient(): Promise<MongoClient> {
  global.__timeHouseMongo ??= connect();
  return global.__timeHouseMongo;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  // The database name travels in the URI (…/Time_house).
  return client.db();
}

/** True when a connection string is configured at all. */
export const isDatabaseConfigured = Boolean(uri);
