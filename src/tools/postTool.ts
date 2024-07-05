import { Request, Response } from 'express';
import { tools, Tool } from '../utils/models';
import { authorize } from '../utils/firebase';

export const postTool = async (req: Request, res: Response) => {
  try {
    // Extract properties from request body
    const { name, category, reserverID } = req.body;

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