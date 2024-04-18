import * as dotenv from 'dotenv';
import { dirname } from 'path';
import * as process from 'process';
dotenv.config();

// Main
export const ORIGINS = [process.env.FRONTEND_DOMAIN];
export const BACKEND_DOMAIN = [process.env.BACKEND_DOMAIN];
export const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN;
export const PORT = process.env.PORT || 8000;
export const ENV = process.env.ENV || 'development';
export const IS_PRODUCTION = ENV === 'production';
export const SERVER_ERROR_MESSAGE = 'Something went wrong';
export const CATEGORY_TREE_MAX_DEPTH = 10;
export const PAGINATION_DEFAULT_LIMIT = 20;
export const BESTSELLERS_DEFAULT_LIMIT = 5;
export const TOP_CATEGORIES_DEFAULT_LIMIT = 3;

// File upload params
export const UPLOAD_FOLDER_PATH = `${dirname(dirname(__dirname))}/public/images/`;

export const NOT_FOUND_PAGE_PATH = `${dirname(dirname(__dirname))}/public/404.html`;

export const ALLOWED_IMG_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// JWT
export const JWT_CONSTANTS = JSON.parse(process.env.JWT_CONSTANTS);
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const JWT_ACCESS_TOKEN_EXPIRATION_TIME = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '10h';
export const JWT_REFRESH_TOKEN_EXPIRATION_TIME = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '1h';

// Database credentials
export const DB_USERNAME = process.env.DB_USERNAME || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_NAME = process.env.DB_NAME || 'hayerenik';
export const DB_PORT = process.env.DB_PORT || '3306';
export const DIRECTORY_FILE_NOT_FOUND_MESSAGE = 'ENOENT: no such file or directory';

// Stripe configs
export const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY ||
  'sk_test_51MUyawCgS2g8x3MCb20OtjLDaI6YwHtEQKI4ZEkqvQ460ddmVAXLJ1HgeuLHOvis08SSZvHnz3TVJdt8QNshXZlb00yBhUBGWa';
export const STRIPE_CURRENCY = process.env.STRIPE_CURRENCY || 'usd';
export const STRIPE_MODE = process.env.STRIPE_MODE || 'payment';

export const STRIPE_FRONTEND_SUCCESS_URL = `${FRONTEND_DOMAIN}?hash=`;
export const STRIPE_FRONTEND_CANCEL_URL = `${FRONTEND_DOMAIN}?hash=`;
