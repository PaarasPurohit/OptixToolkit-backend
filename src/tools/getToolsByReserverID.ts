import { Request, Response } from 'express';
import { tools, Tool } from '../utils/models';
import { authorize } from '../utils/firebase';

export const getToolsByReserverID = async (req: Request, res: Response) => {
  try {
    // Extract reserverID from request parameters or query
    const { reserverID } = req.params; // Assuming reserverID is passed as a parameter

    // Query database for tools with the specified reserverID
    const foundTools = await tools.find({ reserverID });

    // Send success response with found tools
    res.status(200).json(foundTools);
  } catch (err) {
    // Handle errors
    console.error('Error fetching tools:', err);
    res.status(500).send('Server Error');
  }
};
