import { Schema } from 'mongoose';

const bookInstanceSchema = new Schema({
    bookTypeID: { type: Schema.Types.ObjectId, ref: 'BookType', required: true },
    isBorrowed: { type: Boolean, default: false },
    updates: [{
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
      }],
    createdAt: { type: Date, default: Date.now },
  });


  

export default bookInstanceSchema;