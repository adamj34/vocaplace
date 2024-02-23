import logger from '../logger/logger';


const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const castedReq = schema.cast({
                body: req.body,
                query: req.query,
                params: req.params,
            })

            console.log(castedReq);

            await schema.validate(castedReq, {strict: true});

            req.body = castedReq.body;
            req.query = castedReq.query;
            req.params = castedReq.params;

            return next();
        } catch (error) {
            logger.error(error);
            return res.status(422).json({
                name: error.name,
                message: error.message, 
                value: error.value, 
                errors: error.errors
            });
        }
    };
}


export default validate;
