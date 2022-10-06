import dotenv from 'dotenv'
dotenv.config();
import { DescribeAddressesCommand } from '@aws-sdk/client-ec2';
import { ec2Client, s3Client } from '../lib/clients.js';
import os from 'os';

const env = process.env.NODE_ENV; // 'dev' or 'prod'

let host_ip = "http://127.0.0.1";

const config = {
    environment: ((env == 'prod') ? 'production' : 'development'),
    app: {
        host: host_ip,
        port: parseInt(process.env.APP_PORT) || 3000,
        sec_port: parseInt(process.env.APP_SEC_PORT) || 3443
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 27017,
        name: process.env.DB_NAME || 'sailmakers_dev'
    },
    mail: {
        office: 'dave@uksailmakers-ne.com',
        access: 'uksail88DM$'
    },
    aws: {
        bucket: ((env === "prod") ? 'sailmakers' : 'sailmakersdev')
    },
    secretKey: 'star-trek-deep-space-nine-dsn',
};

if (env === "prod") {

    var params = {
        Filters: [
            {Name: 'domain', Values: ['vpc']}
        ]
    };

    const command = new DescribeAddressesCommand(params);
    const response = await ec2Client.send(command);
    config['app']['host'] = response.Addresses[0].PublicIp;
}
else {
    const nets = os.networkInterfaces();
    const results = {};
    for (const name of Object.keys(nets)) {
       for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    config['app']['host'] = results['en0'];
}

export default config;

