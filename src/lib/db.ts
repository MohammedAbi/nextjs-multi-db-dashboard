import mysql from "mysql2/promise";

export const hr = mysql.createPool({
  host: process.env.HR_HOST,
  user: process.env.HR_USER,
  password: process.env.HR_PASS,
  database: process.env.HR_DB,
  waitForConnections: true,
  connectionLimit: 10,
});

export const inv = mysql.createPool({
  host: process.env.INV_HOST,
  user: process.env.INV_USER,
  password: process.env.INV_PASS,
  database: process.env.INV_DB,
  waitForConnections: true,
  connectionLimit: 10,
});

export const invoice = mysql.createPool({
  host: process.env.INVOICE_HOST,
  user: process.env.INVOICE_USER,
  password: process.env.INVOICE_PASS,
  database: process.env.INVOICE_DB,
  waitForConnections: true,
  connectionLimit: 10,
});

export const store = mysql.createPool({
  host: process.env.STORE_HOST,
  user: process.env.STORE_USER,
  password: process.env.STORE_PASS,
  database: process.env.STORE_DB,
  waitForConnections: true,
  connectionLimit: 10,
});
export const orders = mysql.createPool({
  host: process.env.STORE_HOST,
  user: process.env.STORE_USER,
  password: process.env.STORE_PASS,
  database: process.env.STORE_DB,
  waitForConnections: true,
  connectionLimit: 10,
});
