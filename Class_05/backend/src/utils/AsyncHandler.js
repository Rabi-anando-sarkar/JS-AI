export const asyncHandler = (requestHandlerFunction) => async (req,res,next) => {
    try {
        await requestHandlerFunction(req,res,next)
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        })
    }
}