// Load the AWS SDK for Node.js
import { fromIni } from '@aws-sdk/credential-providers';
import { EC2Client } from '@aws-sdk/client-ec2';
import { S3Client } from '@aws-sdk/client-s3';

const ec2Client = new EC2Client({
        credentials: fromIni({
                profile: 'BrooklynBrown'
        }),
        region: 'us-east-2'
});


// Create Amazon S3 service object.
const s3Client = new S3Client({
        credentials: fromIni({
            profile: 'BrooklynBrown'
        }),
        region: 'us-east-2'
});

export { ec2Client, s3Client };
