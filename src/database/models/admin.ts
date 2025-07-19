import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

class Admin extends Model {
    public id!: number;
    public userId!: number;
}

Admin.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    sequelize,
    modelName: 'admin'
});

export default Admin;