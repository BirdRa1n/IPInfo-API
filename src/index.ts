import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes';
import downloadGeoLiteDatabase from './utils/downloadDatabase';
import sequelize from './database/database';
import * as dotenv from 'dotenv';
import bcrypt from "bcrypt";
dotenv.config();

import Plan from './database/models/plan';
import User from './database/models/user';
import ApiKey from './database/models/api_key';
import Session from './database/models/sessions';
import Admin from './database/models/admin';
import RequestLog from './database/models/request_log';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

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
        console.log('Plan "Free" ensured');

        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in environment variables');
        }

        let hash;
        try {
            const salt = await bcrypt.genSalt(10);
            hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
        } catch (hashError: any) {
            throw new Error(`Failed to generate admin password hash: ${hashError.message}`);
        }

        const [user, created] = await User.findOrCreate({
            where: { name: 'Admin' },
            defaults: {
                name: 'Admin',
                email: process.env.ADMIN_EMAIL,
                auth_hash: hash,
            },
        });

        if (created) {
            console.log('Admin user created successfully');
            await Admin.create({ userId: user.id });
            console.log('Admin record created');
        } else {
            console.log('Admin user already exists');
        }

        // --- Lógica para garantir o plano "Unlimited" para o Admin ---
        const [unlimitedPlan] = await Plan.findOrCreate({
            where: { name: 'Unlimited' },
            defaults: {
                name: 'Unlimited',
                price: 0,
                maxRequests: 100000,
                maxRequestsPerDay: 1000000,
                maxRequestsPerMonth: 10000000,
                maxRequestsPerYear: 100000000,
                maxApiKeys: 1000,
            },
        });
        console.log('Plan "Unlimited" ensured');

        // Associar o plano ao usuário Admin, se ainda não estiver associado ou se for diferente
        if (user.planId !== unlimitedPlan.id) {
            user.planId = unlimitedPlan.id;
            await user.save();
            console.log('Unlimited plan assigned/updated for Admin');
        } else {
            console.log('Admin already has "Unlimited" plan');
        }
        // --- Fim da lógica para garantir o plano "Unlimited" para o Admin ---

    } catch (error: any) {
        console.error('Error during database sync or initial setup:', error);
        if (process.env.NODE_ENV === 'development') {
            console.error('Stack trace:', error.stack);
        }
    } finally {
        console.log('Initial setup script completed');
    }
})();

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    downloadGeoLiteDatabase();
});
