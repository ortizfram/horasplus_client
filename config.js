import dotenv from 'dotenv';

// Import dotenv only if running in Node.js
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
 const dotenv = require("dotenv");
 dotenv.config();
}

// Fallbacks for environment variables
export const RESP_URL = process.env.RESP_URL || "http://localhost:8000";
export const REQ_URL = process.env.REQ_URL || "http://localhost:8081";
