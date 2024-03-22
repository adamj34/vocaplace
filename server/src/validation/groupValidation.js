import { object, string, number, mixed } from 'yup';

const createGroupSchema = object({
    body: object({
        group_name: string().max(50).trim().strict().required(),
        bio: string().max(500).trim().strict().optional(),
        picture: mixed()
            .test('file-size', 'The file is too large', pic => {
                return !pic || pic.size <= 2 * 1024 * 1024; // 2 MB
            })
            .test('media-type', 'Unsupported Format', pic => {
                return !pic || ['image/jpeg', 'image/png', 'image/jpg'].includes(pic.mimetype);
            })
            .optional(),
    }).required()
});

const updateGroupSchema = object({
    params: object({
        id: number().integer().positive().required(),
    }).required(),
    body: object({
        group_name: string().max(50).trim().strict().optional(),
        bio: string().max(500).trim().strict().optional(),
        picture: mixed()
            .test('file-size', 'The file is too large', pic => {
                return !pic || pic.size <= 2 * 1024 * 1024; // 2 MB
            })
            .test('media-type', 'Unsupported Format', pic => {
                return !pic || ['image/jpeg', 'image/png', 'image/jpg'].includes(pic.mimetype);
            })
            .optional(),
    })
    .required()
    .test('body-not-empty',
        'At least one field must be filled',
        value => Object.keys(value).length > 0)
});


const groupIdSchema = object({
    params: object({
        id: number().integer().positive().required(),
    }).required()
});

const deleteMemberSchema = object({
    params: object({
        id: number().integer().positive().required(),  // group id
        userId: string().uuid().trim().strict().required()
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

const passAdminRightsSchema = object({
    body: object({
        user_id_to_make_admin: string().uuid().trim().strict().required(),
    }).required(),
    params: object({
        id: number().integer().positive().required(),  // group id
    }).required()
});


export {
    createGroupSchema,
    updateGroupSchema,
    groupIdSchema,
    deleteMemberSchema,
    updateMembershipSchema,
    passAdminRightsSchema
};
