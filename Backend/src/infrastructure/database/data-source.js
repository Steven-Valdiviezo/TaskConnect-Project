import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { schemas } from '../orm/entities/index.js';
import pg from 'pg';

// Igual que en el connection.js anterior: los NUMERIC llegan como número y no como texto
pg.types.setTypeParser(1700, (valor) => (valor === null ? null : parseFloat(valor)));

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: schemas,
  synchronize: false, // la BD ya existe con sus triggers, TypeORM no debe tocarla
  logging: ['error']
});