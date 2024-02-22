import { object, string } from 'yup';

const searchGroupsAndUsersSchema = object({
    query: object({
        searchPhrase: string().trim().strict().required(),
    }).required()
});


export {
    searchGroupsAndUsersSchema,
};
