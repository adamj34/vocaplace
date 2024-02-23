import { object, string, boolean, number } from 'yup';


const getVistedUserIdSchema = object({
    params: object({
        visitedUserId: string().uuid().trim().strict().required(),
    }).required()
});

const updateUserSchema = object({
    body: object({
        username: string().trim().strict().optional(),
        bio: string().max(500).trim().strict().optional(),
        picture: string().trim().strict().optional(),
        private_profile: boolean().optional(),
    })
    .required()
    .test('body-not-empty',
          'At least one field must be filled',
           value => Object.keys(value).length > 0)
});

const updatePointsSchema = object({
    body: object({
        points: number().integer().required()
    }).required()
});


export {
    getVistedUserIdSchema,
    updateUserSchema,
    updatePointsSchema,
};
