require('dotenv').config();
var AWS = require('aws-sdk');

const env = process.env.NODE_ENV; // 'dev' or 'test'


let host_ip = "http://127.0.0.1";

if (env === "prod") {
    // Set the AWS region
    AWS.config.update({region: 'us-east-2'});
    var credentials = new AWS.SharedIniFileCredentials({profile: 'BrooklynBrown'});
    AWS.config.credentials = credentials;


    // Create EC2 service object
    var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

    var params = {
        Filters: [
            {Name: 'domain', Values: ['vpc']}
        ]
    };

    // Retrieve Elastic IP address descriptions
    ec2.describeAddresses(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            // console.log("Success", JSON.stringify(data.Addresses));
            let rData = data.Addresses;
            host_ip = rData[0]['PublicIp'];
        }
    });
}
else {
    host_ip = "http://192.168.1.4"
}


const prod = {
    environment: 'production',
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
        id: process.env.AWS_ID,
        key: process.env.AWS_KEY,
        bucket: 'sailmakerspdf'
    },
    secretKey: 'star-trek-deep-space-nine-dsn',
};

const dev = {
    environment: 'development',
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
        id: process.env.AWS_ID,
        key: process.env.AWS_KEY,
        bucket: 'sailmakerspdfdev'
    },
    secretKey: 'star-trek-deep-space-nine-dsn',
};

const config = {
    prod,
    dev
};


module.exports = config[env];
