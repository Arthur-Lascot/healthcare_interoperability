import {Request, Response, NextFunction, RequestHandler} from "express"

export function asyncHandler<Params = any, ResBody = any, ReqBody = any, ReqQuery = any>(
    fn : (
        req: Request<Params, ResBody, ReqBody, ReqQuery>,
        res: Response,
        next: NextFunction
    ) => Promise<any>
): RequestHandler<Params, ResBody, ReqBody, ReqQuery> {
    return (req, res ,next) => {
        fn(req, res, next).catch(next)
    }
}