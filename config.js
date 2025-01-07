

import { RESP_URL_ENV, REQ_URL_ENV,GOOGLE_MAPS_API_KEY } from '@env';//react native dotenv y babel config

export const RESP_URL = RESP_URL_ENV || "http://localhost:8000";
export const REQ_URL = REQ_URL_ENV || "http://localhost:8081";
export const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEY || "GOOGLE_MAPS_API_KEY";