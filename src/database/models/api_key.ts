import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import User from "./user";

class ApiKey extends Model {
    public key!: string;
    public status!: string;
    public userId!: number;
    public createdAt!: Date;
    public expiresAt?: Date | null;
    public name?: string;
    public User?: User; // Definindo a associação
}

ApiKey.init({
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'revoked'),
        allowNull: false,
        defaultValue: 'active'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'api_key'
});

export default ApiKey;
