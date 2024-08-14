import express from 'express';
import { BookInstance, BookType } from '../model';

const router = express.Router();

// router.get('/', async (req, res) => {
//     // current是当前的页码，每页20条数据
//     const {current = 1, pageSize = 20, name, author, category} = req.query;
//     // 显示当前页码的页面，需要略过当前页面之前的所有数据，并且限制返回的数据为pageSize
//     const data = await BookType.find({
//         ...(name && { name }),
//         ...(author && { author }),
//         ...(category && { category }),
//     })
//         .skip((Number(current) - 1 ) * Number(pageSize))
//         .limit(Number(pageSize));
//     const total = await BookType.countDocuments({
//         ...(name && { name }),
//         ...(author && { author }),
//         ...(category && { category }),
//     });
//     return res.status(200).json({ data, total });
// });
router.get('/', async (req, res) => {
    const {current = 1, pageSize = 20, name, author, category} = req.query;
    try {
        const data = await BookType.aggregate([
            { $match: {
                ...(name && { name }),
                ...(author && { author }),
                ...(category && { category }),
            }},
            { $skip: (Number(current) - 1) * Number(pageSize) }, // 计算跳过的记录数
            { $limit: Number(pageSize) },
            {
                $lookup: {
                    from: "BookInstances",
                    let: { bookTypeId: "$_id" },
                    pipeline: [
                        { $match: 
                            { $expr:
                                { $and:
                                    [
                                        { $eq: ["$bookTypeID", "$$bookTypeId"] },
                                        { $eq: ["$isBorrowed", false] }
                                    ]
                                }
                            }
                        },
                        { $count: "availableCount" }
                    ],
                    as: "availableInstances"
                }
            },
            {
                $addFields: {//添加内容：将availableInstances中的availableCount提取出来
                    availableCount: { $ifNull: [{ $arrayElemAt: ["$availableInstances.availableCount", 0] }, 0] }
                }
            },
            { $project: { availableInstances: 0 } }//丢弃availableInstances数组
        ]);

        const total = await BookType.countDocuments({
            ...(name && { name }),
            ...(author && { author }),
            ...(category && { category }),
        });

        return res.status(200).json({ data, total });
    } catch (error) {
        console.error('Error fetching book types:', error);
        return res.status(500).json({ message: 'Error fetching book types' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newBookType = new BookType(req.body);  // 创建一个新的 BookType 实例
        const savedBookType = await newBookType.save();  // 保存到数据库

        // 如果提供了 stock 并且大于 0，创建相应数量的 BookInstance
        if (savedBookType.stock as number> 0) {
            const instances = Array.from({ length: savedBookType.stock }, () => ({
                bookTypeID: savedBookType._id,  // 关联到新创建的 BookType
                isBorrowed: false,  // 默认未借出
            }));

            // 批量插入 BookInstance 记录
            await BookInstance.insertMany(instances);
        }

        res.status(201).json(savedBookType);  // 返回创建成功的状态和数据
    } catch (error) {
        console.error('Error creating new BookType:', error);
        res.status(500).json({ message: 'Failed to create new BookType' });  // 处理错误
    }
});

router.get('/categories', async (req, res) => {
    try {
        const data = await BookType.distinct("category");
        res.json({data});
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        res.status(500).json({ message: "获取分类失败", error });
    }
});

// 删除逻辑
router.delete('/:id', async (req, res)=>{
    const { id } = req.params;
    await BookType.findByIdandDelete(id);
    return res.status(204).json({ success: true });
});

router.get('/:id', async(req, res)=>{
    const { id } = req.params;
    try {
        const book = await BookType.findById(id);  // 使用 Mongoose 的 findById 方法查询文档
        if (!book) {
            // 如果没有找到 BookType，返回 404 Not Found
            return res.status(404).json({ message: 'BookType not found' });
        }
        // 如果找到了 BookType，返回这个文档
        return res.status(200).json(book);
    } catch (error) {
        // 如果查询过程中发生错误，返回 500 Internal Server Error
        console.error('Error fetching BookType:', error);
        return res.status(500).json({ message: 'Error fetching BookType' });
    }    
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // 这里只包含需要更新的字段
    try {
        const updatedBookType = await BookType.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBookType) {
            return res.status(404).json({ message: 'BookType not found' });
        }
        return res.status(200).json(updatedBookType);
    } catch (error) {
        console.error('Error updating BookType:', error);
        return res.status(500).json({ message: 'Error updating BookType' });
    }
});



export default router;