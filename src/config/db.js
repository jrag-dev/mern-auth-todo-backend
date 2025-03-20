import mongoose from 'mongoose';


class MongoDatabase {

  constructor() {
    this._connect();
  }

  async _connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Mongo Database connection successful');
    } catch (err) {
      console.log('Database connection error: ', err);
    }
  }

  static getInstance() {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    return MongoDatabase.instance;
  }
}


export default MongoDatabase.getInstance();