import { object, string } from 'yup';


const createTopicSchema = object({
    body: object({
        topic:
            string()
            .max(50)
            .trim()
            .strict()
            .required(),
        unit: 
            string()
            .max(50)
            .trim()
            .strict()
            .required(),
        icon: string().optional(),
    }).required()
});


export {
    createTopicSchema
};
