import logger from '../logger/logger';


const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validate({
                body: req.body,
                query: req.query,
                params: req.params,
            });
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
