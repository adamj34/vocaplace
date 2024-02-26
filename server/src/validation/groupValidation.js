import { object, string, number } from 'yup';

const createGroupSchema = object({
    body: object({
        group_name: string().max(50).trim().strict().required(),
        bio: string().max(500).trim().strict().optional(),
        picture: string().optional(),
    }).required()
});

const joinGroupSchema = object({
    body: object({
        group_name: string().max(50).trim().strict().required(),
    }).required()
});

const getGroupInfoSchema = object({
    params: object({
        id: number().integer().positive().required(),
    }).required()
});

const deleteMemberSchema = object({
    body: object({
        user_id_to_delete: string().uuid().trim().strict().required(),
    }).required(),
    params: object({
        id: number().integer().positive().required(),  // group id
    }).required()
});

const updateMembershipSchema = object({
    body: object({
        user_id_to_update: string().uuid().trim().strict().required(),
    }).required(),
    params: object({
        id: number().integer().positive().required(),  // group id
    }).required()
});


export {
    createGroupSchema,
    joinGroupSchema,
    getGroupInfoSchema,
    deleteMemberSchema,
    updateMembershipSchema
};
