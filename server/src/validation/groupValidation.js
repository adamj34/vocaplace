import { object, string, number } from 'yup';

const createGroupSchema = object({
    body: object({
        group_name: string().max(100).trim().strict().required(),
        bio: string().max(1000).trim().strict().optional(),
        picture: string().optional(),
    }).required()
});

const joinGroupSchema = object({
    body: object({
        group_name: string().max(100).trim().strict().required(),
    }).required()
});

const getGroupInfoSchema = object({
    params: object({
        id: number().integer().positive().required(),
    }).required()
});


export {
    createGroupSchema,
    joinGroupSchema,
    getGroupInfoSchema,
};
