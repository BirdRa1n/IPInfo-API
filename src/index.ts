import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes';
import downloadGeoLiteDatabase from './utils/downloadDatabase';
import sequelize from './database/database';
import * as dotenv from 'dotenv';
dotenv.config();

import Plan from './database/models/plan';
import User from './database/models/user';
import ApiKey from './database/models/api_key';
import Session from './database/models/sessions';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// Define associations after all models are imported
User.hasMany(ApiKey);
ApiKey.belongsTo(User);
ApiKey.belongsTo(Plan);
User.belongsTo(Plan);
User.hasMany(Session);
Session.belongsTo(User);

(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced successfully');

        await Plan.findOrCreate({
            where: { name: 'Free' },
            defaults: {
                name: 'Free',
                price: 0,
                maxRequests: 100,
                maxRequestsPerDay: 1000,
                maxRequestsPerMonth: 10000,
                maxRequestsPerYear: 100000,
            },
        });

        const bcrypt = require('bcrypt');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

        await User.findOrCreate({
            where: { name: 'Admin' },
            defaults: {
                name: 'Admin',
                email: process.env.ADMIN_EMAIL,
                auth_hash: hash
            },
        });

    } catch (error) {
        console.error('Error during database sync or initial setup:', error); // Changed error message for clarity
    }
})();

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    downloadGeoLiteDatabase();
});
