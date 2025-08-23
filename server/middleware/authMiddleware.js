module.exports = function requireAdmin(req, res, next) {
  // Retrieve the custom 'x-user' header from the incoming request
  const userHeader = req.headers['x-user'];

  // If the header is missing, the request is unauthorized
  if (!userHeader) {
    return res.status(401).json({ success: false, message: 'Missing user header' });
  }

  try {
    // Parse the header value from JSON string into a JavaScript object
    const user = JSON.parse(userHeader);

    // Check if the user exists and has the role "admin"
    if (!user || user.role !== 'admin') {
      // If not an admin, deny access with a "Forbidden" response
      return res.status(403).json({ success: false, message: 'Access denied: admin only' });
    }

    // Attach the user object to the request for use in subsequent middleware/routes
    req.user = user;

    // Allow the request to proceed to the next middleware or route handler
    next();

  } catch (error) {
    // Log parsing errors (e.g., invalid JSON in the header)
    console.error('Error parsing user header:', error);

    // Respond with "Bad Request" if the user data in the header is invalid
    return res.status(400).json({ success: false, message: 'Invalid user data in header' });
  }
};