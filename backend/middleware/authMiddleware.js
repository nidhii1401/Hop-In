import jwt from 'jsonwebtoken';

// 1. Verify Token (Authentication)
export const verifyToken = (req, res, next) => {
  // Check for the "token" cookie (set by our new Auth Controller)
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied: Please login first' 
    });
  }

  try {
    // Verify the signature using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info (userId, role) to the request object
    req.user = decoded; 
    
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Session expired or invalid token' 
    });
  }
};

// 2. Verify Owner (Authorization)
export const verifyOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  // Check role from the DECODED token, not a plain cookie
  if (req.user.role === 'OWNER' || req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden: Access restricted to Owners only' 
    });
  }
};

// 3. Verify Admin (Authorization)
export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden: Access restricted to Admins only' 
    });
  }
};
