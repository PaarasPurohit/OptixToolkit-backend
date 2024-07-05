import { Request, Response } from 'express';
import { tools, Tool } from '../utils/models';
import { authorize } from '../utils/firebase';

export const deleteTool = async (req: Request, res: Response) => {
  try {
    // Extract name and reserverID from request parameters or body
    const { name, reserverID } = req.body;

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
