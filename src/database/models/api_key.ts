import { DataTypes } from "sequelize";
import sequelize from "../database";

const ApiKey = sequelize.define('api_key', {
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('active', 'revoked'),
        allowNull: false,
        defaultValue: 'active'
    }
});

export default ApiKey;