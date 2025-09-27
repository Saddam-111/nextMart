import jwt from 'jsonwebtoken'


export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    //console.log("Token in cookies:", token);  // Check if token is received

    if (!token) {
      return res.status(400).json({
        message: "User doesn't have token"
      });
    }

    // Verify the token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      console.log("Invalid token: verification failed");
      return res.status(400).json({
        message: "Invalid Token"
      });
    }

    req.userId = verifyToken.userId;
    //console.log("Verified userId:", req.userId);  // Log userId after token verification

    next();
  } catch (error) {
    console.log("Error in isAuth:", error);  // Log the error if any
    return res.status(500).json({
      message: "isAuth error"
    });
  }
};
