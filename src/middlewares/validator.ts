import Joi from 'joi';
import {Request, Response, NextFunction} from 'express';
import Logger from '../helpers/Logger';
import {BadRequestError} from '../core/ApiError';
export enum ValidationSource {
    BODY = 'body',
    HEADER = 'headers',
    QUERY = 'query',
    PARAM = 'params',
    COOKIES = 'cookies'
}

export default (
    schema: Joi.AnySchema,
    source: ValidationSource = ValidationSource.BODY
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const {error} = schema.validate(req[source]);

            if (!error) return next();

            const {details} = error;
            const message = details
                .map((i) => i.message.replace(/['"]+/g, ''))
                .join(',');
            Logger.error(message);

            next(new BadRequestError(message));
        } catch (error) {
            next(error);
        }
    };
};
