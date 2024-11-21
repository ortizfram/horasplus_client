import dotenv from 'dotenv';
dotenv.config();

export const RESP_URL = process.env.RESP_URL || "http://localhost:8000";
export const REQ_URL = process.env.REQ_URL || "http://localhost:8081";
