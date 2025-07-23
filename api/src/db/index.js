import mongoose from 'mongoose';

const connectDB =async ()=>{ // database is always in another continent 
    try {
       const connectionInstance =  await  mongoose.connect(`${process.env.MONGODB_URI}`)

       console.log(`\n MongoDB connected !! DB HOST :${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDb Connection Error",error);
        process.exit(1)
        
    }
}
export default connectDB;