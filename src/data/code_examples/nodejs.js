const express = require('express');
const jwt = require('jsonwebtoken');

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route example
app.get('/api/protected', authMiddleware, async (req, res) => {
  try {
    // Access authenticated user data
    const userId = req.user.id;
    
    // Do something with the authenticated user...
    const userData = await db.users.findById(userId);
    
    res.json({ data: userData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}); 