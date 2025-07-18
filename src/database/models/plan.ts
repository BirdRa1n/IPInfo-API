import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

class Plan extends Model {
    public id!: number;
    public name!: string;
    public price!: number;
    public maxRequests!: number;
    public maxRequestsPerDay!: number;
    public maxRequestsPerMonth!: number;
    public maxRequestsPerYear!: number;
}

Plan.init({
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
    },
}, {
    sequelize,
    modelName: 'plan'
});

export default Plan;