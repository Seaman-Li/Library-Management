import { Schema } from 'mongoose';

const bookTypeSchema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  cover: { type: String },
  category: { type: String },
  description: { type: String },
  publishAt: { type: Number },
  stock:{type: Number},
  updates: [{
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default bookTypeSchema;