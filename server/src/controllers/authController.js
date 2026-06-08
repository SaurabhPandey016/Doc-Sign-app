import * as authService from '../services/authService.js';

export const handleRegister = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required parameters: name, email, and password." });
  }

  try {
    const user = await authService.registerUser(name, email, password);
    res.status(201).json({ message: "User account created successfully.", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required parameters: email and password." });
  }

  try {
    // Destructure token and user cleanly out of your service return mapping
    const { token, user } = await authService.loginUser(email, password);

    // Inject token safely into an HttpOnly cookie channel
    res.cookie('token', token, {
      httpOnly: true, // Blocks browser-side JavaScript access vectors (XSS Guard)
      secure: process.env.NODE_ENV === 'production', // Enforces SSL transmission context in production
      sameSite: 'lax', // Guards against CSRF transaction attacks
      maxAge: 24 * 60 * 60 * 1000 // 24-hour cookie life window
    });

    // Return message and the user metadata profile back to client view frame
    res.status(200).json({ 
      message: "Authentication successful.", 
      user 
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Clear session credentials securely
export const handleLogout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Session wiped cleanly." });
};
