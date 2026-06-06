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
    const data = await authService.loginUser(email, password);
    res.status(200).json({ message: "Authentication successful.", ...data });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};