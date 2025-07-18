import { DataTypes } from "sequelize";
import sequelize from "../database";
import User from "./user";
import Plan from "./plan";

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

ApiKey.belongsTo(User);
ApiKey.belongsTo(Plan);

export default ApiKey;