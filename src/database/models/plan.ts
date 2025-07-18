import { DataTypes } from "sequelize";
import sequelize from "../database";

const Plan = sequelize.define('plan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    maxRequests: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maxRequestsPerDay: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maxRequestsPerMonth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maxRequestsPerYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default Plan;