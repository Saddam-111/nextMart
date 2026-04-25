import jwt from 'jsonwebtoken';

export const isAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required: no token provided"
      });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    const statusCode = error.name === 'JsonWebTokenError' ? 401 :
                       error.name === 'TokenExpiredError' ? 401 : 500;
    const message = error.name === 'JsonWebTokenError' ? 'Invalid token' :
                    error.name === 'TokenExpiredError' ? 'Token expired' :
                    'Authentication error';

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

