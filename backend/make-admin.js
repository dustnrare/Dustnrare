require('dotenv').config();
const admin = require('./config/firebase');
const mongoose = require('mongoose');
const { User } = require('./models');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

async function run() {
  console.log('--- Starting Admin Script ---');
  await connectDB();
  console.log('Firebase init checking...');
  
  try {
    const listUsersResult = await admin.auth().listUsers(10);
    const users = listUsersResult.users;
    
    if (users.length === 0) {
      console.log("⚠️ No users found in Firebase. Please sign up on the frontend first!");
      process.exit(0);
    }
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`[${i+1}/${users.length}] Checking user: ${user.email} (${user.uid})`);
      
      // Set Firebase claim
      await admin.auth().setCustomUserClaims(user.uid, { role: 'seller' });
      
      // Update MongoDB role
      await User.findOneAndUpdate(
        { uid: user.uid },
        { $set: { role: 'seller' } },
        { upsert: true }
      );
      
      console.log(`✅ Success for ${user.email || user.phoneNumber}.`);
    }
    
    console.log("\n🎉 Admin access granted! You can now log into the frontend and access the Dashboard.");
  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    process.exit(0);
  }
}

run();
