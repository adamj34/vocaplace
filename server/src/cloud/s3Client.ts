import { S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import logger from '../logger/logger';


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

const getPreSignedUrl = async (pictureName: string) => {
    return await getSignedUrl(s3Instance,
        new GetObjectCommand({Bucket: process.env.AWS_BUCKET_NAME, Key: pictureName}),
        {expiresIn: 120}
    ) 
};

const pictureToSignedUrl = async (payload) => {
    if (typeof payload === 'object' && payload.picture) {
        payload.picture = await getPreSignedUrl(payload.picture);
        logger.info('Picture URL signed');  
    } else if (Array.isArray(payload) && payload.every(item => typeof item === 'object')) {
        await Promise.all(payload.map(async (item) => {
            if (item.picture) {
                item.picture = await getPreSignedUrl(item.picture);
            }
        }));
        logger.info('Picture URLs signed'); 
    }

    return payload;
};

enum PictureFolder {
    PROFILE = 'profile_pictures',
    GROUP = 'group_pictures',
}

export {
    s3Instance,
    pictureToSignedUrl,
    PictureFolder 
};
