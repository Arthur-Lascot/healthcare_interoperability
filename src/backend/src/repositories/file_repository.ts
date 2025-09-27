import { UUID } from "crypto";
import { FileEntity } from "../entities/FileEntity";
import { FileNotFoundError } from "../errors/FileNotFound";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const getFileFromUUID = async (uuid: UUID): Promise<FileEntity> => {
    const result = await pool.query(
      "SELECT * FROM DocumentReference WHERE uuid = $1",
      [uuid]
    );

    if (result.rows.length === 0) {
        throw new FileNotFoundError(uuid);
    }

    return result.rows[0];
};

export const getAllFiles = async(): Promise<FileEntity[]> => {
    const result = await pool.query(
      "SELECT * FROM DocumentReference",
    );

    return result.rows;
}
