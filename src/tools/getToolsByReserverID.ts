import { Request, Response } from 'express';
import { tools } from '../utils/models';
import { authorize } from '../utils/firebase';

const getToolsByReserverID = async (req: Request, res: Response) => {
  try {
    // Extract reserverID from request parameters
    const { reserverID } = req.params;

    // Ensure the user is authorized
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const user = await authorize(token);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

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

export default getToolsByReserverID;
