import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

class RequestLog extends Model {
    public id!: number;
    public apiKeyId!: string;
    public userId?: number; // Tornar opcional
    public timestamp!: Date;
    public ipAddress!: string;
    public endpoint!: string;
    public success!: boolean;
    public errorMessage?: string;
}

RequestLog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    apiKeyId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'api_keys',
            key: 'key'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permitir null
        references: {
            model: 'users',
            key: 'id'
        }
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endpoint: {
        type: DataTypes.STRING,
        allowNull: false
    },
    success: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    errorMessage: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'request_log'
});

export default RequestLog;
