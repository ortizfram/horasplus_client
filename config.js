

import { RESP_URL_ENV, REQ_URL_ENV,GOOGLE_MAPS_API_KEY_ENV,TWILIO_ACCOUNT_SID_ENV,TWILIO_AUTH_TOKEN_ENV } from '@env';//react native dotenv y babel config

export const RESP_URL = RESP_URL_ENV || "http://localhost:8000";
export const REQ_URL = REQ_URL_ENV || "http://localhost:8081";
export const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEY_ENV || "GOOGLE_MAPS_API_KEY";
export const TWILIO_ACCOUNT_SID = TWILIO_ACCOUNT_SID_ENV || "TWILIO_ACCOUNT_SID";
export const TWILIO_AUTH_TOKEN = TWILIO_AUTH_TOKEN_ENV || "TWILIO_AUTH_TOKEN";