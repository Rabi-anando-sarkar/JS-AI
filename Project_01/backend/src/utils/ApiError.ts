class ApiError<T = unknown> extends Error {
    public statusCode: number;
    public data: null;
    public success: boolean;
    public errors: T[];

    constructor(
        statusCode: number,
        message: string = "Something Went Wrong",
        errors: T[] = [],
        stack: string = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {
    ApiError
};