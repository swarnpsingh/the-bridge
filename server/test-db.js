const mongoose = require('mongoose');

const uri = 'mongodb+srv://swarnpratapsingh5_db_user:theBridge26@thebridge.339nwlf.mongodb.net/thebridge?retryWrites=true&w=majority';

console.log('Attempting connection...');

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS — MongoDB connected!');
    process.exit(0);
  })
  .catch(err => {
    console.log('FAILED:', err.message);
    process.exit(1);
  });