const jwt = require("jsonwebtoken");

// Security-enhanced JWT verification middleware
const authMiddleware = (req, res, next) => {
  // 1. Token Extraction
  const token = req.cookies?.authToken || 
                req.headers['authorization']?.split(' ')[1]; // Also checks Bearer token

  if (!token) {
    console.warn('[AUTH] Access attempt without token', {
      path: req.path,
      ip: req.ip
    });
    return res.status(401).json({ 
      error: "Authentication required",
      docs: process.env.NODE_ENV === 'development' 
        ? "https://docs.yoursite.com/auth" 
        : undefined
    });
  }

  // 2. Token Verification
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // Explicit algorithm specification
      clockTolerance: 15, // 15-second grace period for clock skew
    });

    // 3. Security Logging
    console.log(`[AUTH] Authenticated user ${decoded.id}`, {
      route: req.path,
      method: req.method,
      tokenIssued: new Date(decoded.iat * 1000).toISOString(),
      tokenExpires: new Date(decoded.exp * 1000).toISOString()
    });

    // 4. Context Augmentation
    req.auth = {
      user: decoded,
      token: token.slice(0, 8) + '...' + token.slice(-8), // Partial token for logs
      authMethod: req.cookies.authToken ? 'cookie' : 'bearer'
    };

    next();
  } catch (error) {
    // 5. Enhanced Error Handling
    const errorType = {
      [jwt.JsonWebTokenError]: "Malformed token",
      [jwt.TokenExpiredError]: "Session expired",
      [jwt.NotBeforeError]: "Token not yet valid"
    }[error.constructor] || "Authentication failed";

    console.error(`[AUTH] ${errorType}`, {
      error: error.message,
      path: req.path,
      ip: req.ip
    });

    res.status(401)
      .header('Clear-Site-Data', '"cookies"') // Triggers browser cookie cleanup
      .json({
        error: errorType,
        action: errorType === "Session expired" ? "reauthenticate" : "retry",
        ...(process.env.NODE_ENV === 'development' && {
          details: error.message,
          stack: error.stack
        })
      });
  }
};

module.exports = authMiddleware;