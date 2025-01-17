import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/postModel.js'; 
import User from './models/userModel.js';

// Load environment variables
dotenv.config();

// Sample posts data
const postsData = [
    {
      author: "678ab01ee09744ef13ed4157",
      content: "The journey of coding is a mix of persistence, creativity, and discovery. 💻 Every day, I learn something new that challenges me to think differently and improve. 🌟 Recently, I tackled a complex bug, and the satisfaction of solving it was unmatched! 🔧 It’s these moments that remind me why I love problem-solving. Here’s to embracing challenges and growing with every line of code. 🚀",
      likes: [],
      comments: []
    },
    {
      author: "678ab01ee09744ef13ed4157",
      content: "Just wrapped up an incredible sprint with my team, and I couldn’t be prouder of what we’ve accomplished. 🏁 The collaboration, late-night brainstorming, and problem-solving made this experience unforgettable. 🤝 It’s a reminder that great things are built when we work together with a shared vision. 🌟 Now, we’re gearing up for the next phase, and I’m excited about what’s to come. Let’s keep the momentum going! 🚀",
      likes: [],
      comments: []
    },
    {
      author: "678ab01ee09744ef13ed415b",
      content: "Networking is such a powerful tool for growth, and I experienced that firsthand this week. 🤝 Connecting with professionals from diverse industries opened my eyes to new ideas and perspectives. 🌍 It’s amazing how sharing stories and insights can spark inspiration. Whether it’s a quick chat or a deep conversation, every connection adds value. Let’s continue building meaningful relationships that help us grow together! 🌟",
      likes: [],
      comments: []
    },
    {
      author: "678ab01ee09744ef13ed415b",
      content: "Reflecting on the importance of mental health, especially in high-pressure environments. 💭 It’s essential to pause, breathe, and recharge. 🌱 Taking time for self-care has helped me stay focused and creative. Balancing productivity with mindfulness has been a game-changer in both my personal and professional life. Let’s continue to prioritize our well-being as we chase our dreams! ✨",
      likes: [],
      comments: []
    },
    {
      author: "678ab01ee09744ef13ed415f",
      content: "Innovation thrives on curiosity, and that’s something I’ve been embracing lately. 🌟 Diving into the latest tech trends has been both exciting and challenging. 🔍 From exploring AI to understanding blockchain, the possibilities are endless! Every new concept feels like a door to another world of opportunities. 🚀 Here’s to staying curious and pushing boundaries to shape the future of technology! 💻",
      likes: [],
      comments: []
    }
  ]
  
// Function to seed posts
const seedPosts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected successfully');

    // Find a user to use as the author (you can modify this logic)
    const user = await User.findOne();
    if (!user) {
      console.error('No users found. Please seed users first.');
      process.exit(1);
    }

    // Replace author with actual user _id
    const postsWithAuthor = postsData.map(post => ({
      ...post,
      author: user._id
    }));

    // Insert posts
    const insertedPosts = await Post.insertMany(postsData);
    console.log(`${insertedPosts.length} posts inserted successfully`);

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedPosts();