// src/database/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbName: string = process.env.DB_DATABASE || '';
const dbUser: string = process.env.DB_USER || '';
const dbPassword: string = process.env.DB_PASSWORD || '';
const dbHost: string = process.env.DB_HOST || '';
const dbPort: number = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "postgres",
    logging: false,
    timezone: "America/Sao_Paulo",
    dialectOptions: {
        // Desabilite SSL para conexões internas no Docker, ou torne-o condicional
        ssl: process.env.DB_SSL === 'true' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    }
});

export default sequelize;
