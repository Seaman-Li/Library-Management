import bookInstanceSchema from "./BookInstanceModel";
import bookTypeSchema from "./BookTypeModel";
import borrowSchema from "./BorrowModel";
import userSchema from "./UserModel";

const mongoose = require('mongoose');
var uri =
  'mongodb://root:root@ac-cfwx5aj-shard-00-00.qktlz8d.mongodb.net:27017,ac-cfwx5aj-shard-00-01.qktlz8d.mongodb.net:27017,ac-cfwx5aj-shard-00-02.qktlz8d.mongodb.net:27017/?ssl=true&replicaSet=atlas-c9x2xc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=bookManagement'

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.useDb('test');
}

main()
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log(err);
  });


  const User = mongoose.model('User', userSchema,'Users');
  const BookType = mongoose.model('BookType', bookTypeSchema,'BookTypes');
  const BookInstance = mongoose.model('BookInstance', bookInstanceSchema,'BookInstances');
  const Borrow = mongoose.model('Borrow', borrowSchema,'Borrows');

  export {User, BookType, BookInstance, Borrow};