import { Request, Response } from 'express';
import { tools } from '../utils/models';
import { authorize } from '../utils/firebase';

const deleteToolByReserverID = async (req: Request, res: Response) => {
  try {
    // Extract name and reserverID from request body
    const { name, reserverID } = req.body;

    // Ensure the user is authorized
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const user = await authorize(token);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find and delete the tool with both name and reserverID
    const deletedTool = await tools.findOneAndDelete({ name, reserverID });

    if (!deletedTool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    // Send success response
    res.status(200).json({ message: 'Tool deleted successfully', deletedTool });
  } catch (err) {
    // Handle errors
    console.error('Error deleting tool:', err);
    res.status(500).send('Server Error');
  }
};

export default deleteToolByReserverID;
