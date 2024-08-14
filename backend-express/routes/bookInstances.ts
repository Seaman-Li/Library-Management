import express from 'express';
import { BookInstance, BookType } from '../model';
import { Document } from 'mongoose';

const router = express.Router();

interface BookInstanceQuery {
    bookTypeID?: { $in: string[] };
    isBorrowed?: boolean;
    _id?: string;
  }

router.get('/', async (req, res) => {
    const { current = 1, pageSize = 20, bookName, isBorrowed, _id } = req.query;

    try {
        let bookInstanceQuery: BookInstanceQuery = {
            ...(_id && { _id: _id as string }), // 确保类型转换，因为req.query中的参数默认是字符串
            ...(isBorrowed && {isBorrowed: isBorrowed === 'true'})
        };
        
        if (bookName) {
            const bookTypeIds = await BookType.distinct('_id', { name: bookName });
            if (bookTypeIds.length > 0) {
                bookInstanceQuery = {
                    ...bookInstanceQuery,
                    bookTypeID: { $in: bookTypeIds }
                };
            }
        }

        const data = await BookInstance.find(bookInstanceQuery)
            .populate('bookTypeID', 'name') // 填充 BookType 的 name
            .skip((Number(current) - 1) * Number(pageSize))
            .limit(Number(pageSize));

        // 计算总数，用于分页
        const total = await BookInstance.countDocuments(bookInstanceQuery);

        return res.status(200).json({ data, total });
    } catch (error) {
        console.error('Error fetching book instances:', error);
        return res.status(500).json({ message: 'Error fetching book instances' });
    }
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;            // From URL, get the resource ID
    const updateData = req.body;          // From request body, get update data
    // const userId = req.user._id;          // Assuming you have user ID from session or token
    try {
        // Find the BookInstance by ID
        const bookInstance = await BookInstance.findById(id);
        if (!bookInstance) {
            return res.status(404).json({ message: 'BookInstance not found' });
        }
        // Update fields directly
        bookInstance.set(updateData);
        // Add a new update entry
        bookInstance.updates.push({
            updatedAt: new Date(),  // Current time
            // updatedBy: userId       // User who made the change
        });
        // Save the updated document
        const updatedBookInstance = await bookInstance.save();
        return res.status(200).json(updatedBookInstance);
    } catch (error) {
        console.error('Error updating BookInstance:', error);
        return res.status(500).json({ message: 'Error updating BookInstance' });
    }
});


export default router;