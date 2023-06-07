
module.exports = (req, res, next) => {
    try {
        if(!req.user || req.user.role !== 'User') {
            return res.status(403).json({
                status: 0,
                message: "You don't have access to this request."
            });
        }
        next()
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: "Something went wrong, Please try again later."
        });
    }
}