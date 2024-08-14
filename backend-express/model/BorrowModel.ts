import { Schema } from "mongoose";


// 定义 Borrow 模型
const borrowSchema = new Schema({
  bookInstance: { type: Schema.Types.ObjectId, ref: 'BookInstance', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  borrowedAt: { type: Date, default: Date.now },
  returnAt: { type: Date },
  returnedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default borrowSchema;