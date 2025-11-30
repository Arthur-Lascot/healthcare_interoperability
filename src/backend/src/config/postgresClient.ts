import { Pool } from "pg";

const client = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async() => {
  try {
    const clientInit = await client.connect();
  } catch (err) {
    console.error(err);
  }
} 

export default client;