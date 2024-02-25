import { S3 } from '@aws-sdk/client-s3';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Instance = new S3({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    }
});


export default s3Instance;
