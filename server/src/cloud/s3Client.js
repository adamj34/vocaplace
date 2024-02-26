import { S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";


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

const getPreSignedUrl = async (pictureName) => {
    return await getSignedUrl(s3Instance,
        new GetObjectCommand({Bucket: process.env.AWS_BUCKET_NAME, Key: pictureName}),
        {expiresIn: 120}
    ) 
};

const pictureNameToUrl = async (payload) => {
    if (typeof payload === 'object' && payload.picture) {
        payload.picture = await getPreSignedUrl(payload.picture);
    } else if (Array.isArray(payload) && payload.every(item => typeof item === 'object')) {
        payload.forEach(async (item) => {
            if (item.picture) {
                item.picture = await getPreSignedUrl(item.picture);
            }
        });
    }

    return payload;
};


export { s3Instance, getPreSignedUrl };
