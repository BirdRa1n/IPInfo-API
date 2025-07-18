import * as maxmind from 'maxmind';
import path from 'path';

const databasePath = path.join('src/database/GeoLite2-City.mmdb');

async function fetchLocationByIp(ipAddress: string) {
    try {
        const lookup = await maxmind.open(databasePath);
        return lookup.get(ipAddress);
    } catch (error) {
        console.error('Error accessing the database:', error);
        console.error('Attempted DB path:', databasePath);
    }
}

export default fetchLocationByIp;
