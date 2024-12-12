import cron from 'node-cron'
import RefreshToken from '../Models/RefreshTokenModel.js'

async function deleteExpiredTokens() {
    const now = new Date();
    await RefreshToken.deleteMany({ expiry: { $lt: now } });
    console.log('Expired tokens deleted');
}

export function startTokenCleanupTask() {
    cron.schedule('0 * * * *', async () => {
        console.log('Running expired token cleanup task...');
        await deleteExpiredTokens();
    });
    console.log('Token cleanup task scheduled.');
}

