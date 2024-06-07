import { object, string, number } from 'yup';


const createUnitSchema = object({
    body: object({
        unit:
            string()
            .max(50)
            .trim()
            .strict()
            .required(),
        icon: string().trim().strict().optional(),
    }).required()
});

const getDetailedUserProgressSchema = object({
    params: object({
        id: number().integer().positive().required(),
    }).required()
});


export {
    createUnitSchema,
    getDetailedUserProgressSchema,
};
