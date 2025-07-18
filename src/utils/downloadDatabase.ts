import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import axios from 'axios';

const downloadGeoLiteDatabase = async () => {
    const databaseUrl = "https://cdn.jsdelivr.net/npm/geolite2-city/GeoLite2-City.mmdb.gz";
    const databasePath = path.join('src/database', 'GeoLite2-City.mmdb');

    if (fs.existsSync(databasePath)) {
        console.log('Database already downloaded, skipping download');
        return;
    }

    const response = await axios.get(databaseUrl, { responseType: 'arraybuffer' });
    const compressedData = response.data;

    const gunzip = zlib.createGunzip();
    const fileWriter = fs.createWriteStream(databasePath);

    gunzip.on('error', (error) => {
        console.error('Decompression error:', error);
    });

    fileWriter.on('finish', () => {
        console.log('Database downloaded and decompressed successfully');
    });

    gunzip.end(compressedData);
    gunzip.pipe(fileWriter);
};

export default downloadGeoLiteDatabase;
