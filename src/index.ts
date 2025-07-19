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
import Admin from './database/models/admin';
import RequestLog from './database/models/request_log';
import apiKeysRouter from './routes/apiKeys';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
router.use('/api-keys', apiKeysRouter);


// Define associations after all models are imported
User.hasMany(ApiKey);
ApiKey.belongsTo(User);
ApiKey.belongsTo(Plan);
User.belongsTo(Plan);
User.hasMany(Session);
Session.belongsTo(User);
Admin.belongsTo(User);

// Novas associações para RequestLog
ApiKey.hasMany(RequestLog, { foreignKey: 'apiKeyId', sourceKey: 'key' });
RequestLog.belongsTo(ApiKey, { foreignKey: 'apiKeyId', targetKey: 'key' });
User.hasMany(RequestLog, { foreignKey: 'userId' });
RequestLog.belongsTo(User, { foreignKey: 'userId' });


(async () => {
    try {
        await sequelize.sync({ alter: true });
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
                maxApiKeys: 5,
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

        }).then(([user, created]) => {
            if (created) {
                console.log('Admin user created successfully');
                Admin.create({ userId: user.id });
                Plan.findOrCreate(
                    {
                        where: { name: 'Unlimited' },
                        defaults: {
                            name: 'Unlimited',
                            price: 0,
                            maxRequests: 100000,
                            maxRequestsPerDay: 1000000,
                            maxRequestsPerMonth: 10000000,
                            maxRequestsPerYear: 100000000,
                            maxApiKeys: 1000
                        }
                    }).then(([plan]) => {
                        user.set({ planId: plan.id });
                        user.save();
                    })
            } else {
                console.log('Admin user already exists');
            }
        });

    } catch (error) {
        console.error('Error during database sync or initial setup:', error);
    }
})();

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    downloadGeoLiteDatabase();
});
