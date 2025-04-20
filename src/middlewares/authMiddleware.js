const authMiddleware = (req, res, next) => {
    const userId = req.headers['user-id'];

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized, user not found' });
    }
    req.userId = userId;
    next();
};

export default authMiddleware;