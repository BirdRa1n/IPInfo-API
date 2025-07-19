import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Substitua essas informações pelas suas próprias credenciais e configurações do banco de dados
const dbName: string = process.env.DB_DATABASE || '';
const dbUser: string = process.env.DB_USER || '';
const dbPassword: string = process.env.DB_PASSWORD || '';
const dbHost: string = process.env.DB_HOST || '';
const dbPort: number = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432; // Porta padrão do PostgreSQL

// Crie uma nova instância do Sequelize para o PostgreSQL
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "postgres", // Use 'postgres' para PostgreSQL
    logging: false, // Defina como true se desejar ver as consultas SQL executadas
    timezone: "America/Sao_Paulo",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export default sequelize;