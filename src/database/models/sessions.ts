import { DataTypes } from "sequelize";
import sequelize from "../database";

const Session = sequelize.define('session', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Session;