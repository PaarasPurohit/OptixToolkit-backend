import { Request, Response } from 'express';
import { tools } from '../utils/models';
import { authorize } from '../utils/firebase';

const postTool = async (req: Request, res: Response) => {
  try {
    // Extract properties from request body
    const { name, category, reserverID } = req.body;

    // Ensure the user is authorized
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const user = await authorize(token);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Create a new tool instance
    const newTool = new tools({
      name,
      category,
      reserverID,
      isInUse: true  // Set isInUse to true by default
    });

    // Save the new tool to the database
    const savedTool = await newTool.save();

    // Send success response
    res.status(201).json(savedTool);
  } catch (err) {
    // Handle errors
    console.error('Error saving tool:', err);
    res.status(500).send('Server Error');
  }
};

export default postTool;
