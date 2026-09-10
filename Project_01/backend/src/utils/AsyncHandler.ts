import type {
    Request,
    Response,
    NextFunction,
    RequestHandler
} from "express";

export const asyncHandler = (
    requestHandlerFunction: RequestHandler
): RequestHandler => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await requestHandlerFunction(req, res, next);
        } catch (error: unknown) {
            next(error);
        }
    };
};