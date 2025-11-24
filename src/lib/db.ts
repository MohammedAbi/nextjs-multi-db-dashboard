import sql from "mssql";

// Validate required env vars
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
  return value;
}

const config: sql.config = {
  server: requireEnv("AZURE_SQL_SERVER"),
  database: requireEnv("AZURE_SQL_DATABASE"),
  user: requireEnv("AZURE_SQL_USER"),
  password: requireEnv("AZURE_SQL_PASSWORD"),
  options: {
    encrypt: true,
    trustServerCertificate:
      process.env.AZURE_SQL_TRUST_SERVER_CERTIFICATE === "yes",
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let cachedPool: sql.ConnectionPool | null = globalThis.__mssql_pool || null;

export async function getPool() {
  if (cachedPool) {
    if (!cachedPool.connected) {
      await cachedPool.connect();
    }
    return cachedPool;
  }

  cachedPool = new sql.ConnectionPool(config);
  globalThis.__mssql_pool = cachedPool;

  await cachedPool.connect();
  console.log("Connected to Azure SQL");
  return cachedPool;
}

declare global {
  var __mssql_pool: sql.ConnectionPool | undefined;
}

export async function query(queryText: string) {
  const db = await getPool();
  const result = await db.request().query(queryText);
  return result.recordset;
}
