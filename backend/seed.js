import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './config/db.js';
import User from './models/User.js';
import Restaurant from './models/Restaurant.js';
import Review from './models/Review.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      Review.deleteMany({}),
    ]);

    console.log('[Seed] Creating Users...');
    // All passwords satisfy: 8-16 chars, at least 1 upper, 1 lower, 1 digit, 1 special char
    const admin = await User.create({
      name: 'Platform Administrator',
      email: 'admin@platform.com',
      password: 'Admin@1234',
      role: 'admin',
    });

    const owner1 = await User.create({
      name: 'Mario Rossi',
      email: 'owner.mario@platform.com',
      password: 'Owner@1234',
      role: 'owner',
    });

    const owner2 = await User.create({
      name: 'Sakura Tanaka',
      email: 'owner.sakura@platform.com',
      password: 'Owner@1234',
      role: 'owner',
    });

    const owner3 = await User.create({
      name: 'Priya Sharma',
      email: 'owner.priya@platform.com',
      password: 'Owner@1234',
      role: 'owner',
    });

    const customer1 = await User.create({
      name: 'Alex Johnson',
      email: 'customer.alex@example.com',
      password: 'Customer@1234',
      role: 'customer',
    });

    const customer2 = await User.create({
      name: 'Sarah Miller',
      email: 'customer.sarah@example.com',
      password: 'Customer@1234',
      role: 'customer',
    });

    const customer3 = await User.create({
      name: 'David Chen',
      email: 'customer.david@example.com',
      password: 'Customer@1234',
      role: 'customer',
    });

    const customer4 = await User.create({
      name: 'Emma Watson',
      email: 'customer.emma@example.com',
      password: 'Customer@1234',
      role: 'customer',
    });

    console.log('[Seed] Creating Restaurants...');
    const rest1 = await Restaurant.create({
      name: 'Trattoria Bella',
      cuisine: 'Italian',
      location: 'New York',
      address: '142 Mulberry St, Little Italy, New York, NY 10013',
      phone: '+1 (212) 555-0199',
      openingHours: '11:30 AM - 10:30 PM',
      description: 'Authentic wood-fired Neapolitan pizza, fresh handmade pasta, and classic Tuscan wines in a warm rustic setting.',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      owner: owner1._id,
    });

    const rest2 = await Restaurant.create({
      name: 'Sakura Bistro',
      cuisine: 'Japanese',
      location: 'San Francisco',
      address: '788 Japantown Way, San Francisco, CA 94115',
      phone: '+1 (415) 555-0142',
      openingHours: '12:00 PM - 10:00 PM',
      description: 'Artisanal sushi bar, rich tonkotsu ramen, and premium imported Japanese sake crafted by veteran Tokyo chefs.',
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
      owner: owner2._id,
    });

    const rest3 = await Restaurant.create({
      name: 'Spice Symphony',
      cuisine: 'Indian',
      location: 'Chicago',
      address: '450 Devon Ave, West Ridge, Chicago, IL 60659',
      phone: '+1 (312) 555-0188',
      openingHours: '11:00 AM - 11:00 PM',
      description: 'Flavorsome North & South Indian dishes, fresh tandoori oven naan, aromatic biryanis, and rich Mughlai curries.',
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
      owner: owner3._id,
    });

    const rest4 = await Restaurant.create({
      name: 'El Fuego Cantina',
      cuisine: 'Mexican',
      location: 'Austin',
      address: '221 Rainey St, Downtown, Austin, TX 78701',
      phone: '+1 (512) 555-0123',
      openingHours: '12:00 PM - 12:00 AM',
      description: 'Handmade street tacos, slow-roasted barbacoa, house guacamole, and craft mezcal cocktails with live music.',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      owner: null, // Unassigned for admin testing
    });

    const rest5 = await Restaurant.create({
      name: 'Le Bistro Parisien',
      cuisine: 'French',
      location: 'Boston',
      address: '89 Newbury St, Back Bay, Boston, MA 02116',
      phone: '+1 (617) 555-0177',
      openingHours: '5:00 PM - 11:00 PM',
      description: 'Charming French brasserie with duck confit, steak frites, escargots, and an extensive Bordeaux wine cellar.',
      imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
      owner: null, // Unassigned for admin testing
    });

    console.log('[Seed] Creating Reviews with distribution...');
    // Trattoria Bella (Average: ~4.5)
    await Review.create([
      { customer: customer1._id, restaurant: rest1._id, rating: 5, comment: 'Exceptional truffled gnocchi and wood-fired pizza! The crust was airy and perfectly charred.' },
      { customer: customer2._id, restaurant: rest1._id, rating: 5, comment: 'Outstanding service and cozy atmosphere. Best tiramisu in town!' },
      { customer: customer3._id, restaurant: rest1._id, rating: 4, comment: 'Great pasta dishes. Took a little while to get a table on Saturday night, but worth the wait.' },
      { customer: customer4._id, restaurant: rest1._id, rating: 4, comment: 'Authentic flavors and generous portions. House wine was very good.' },
    ]);

    // Sakura Bistro (Average: ~4.7)
    await Review.create([
      { customer: customer1._id, restaurant: rest2._id, rating: 5, comment: 'Omakase was out of this world! Melt in your mouth salmon and toro.' },
      { customer: customer2._id, restaurant: rest2._id, rating: 5, comment: 'Ramen broth was so deep and comforting. Incredible attention to detail.' },
      { customer: customer3._id, restaurant: rest2._id, rating: 4, comment: 'High quality fish and modern zen ambiance. A bit pricey but justified.' },
    ]);

    // Spice Symphony (Average: ~4.3)
    await Review.create([
      { customer: customer1._id, restaurant: rest3._id, rating: 4, comment: 'Delicious butter chicken and garlic naan. Spice levels can be customized.' },
      { customer: customer2._id, restaurant: rest3._id, rating: 5, comment: 'The lamb biryani was heavenly! Huge portion and very flavorful.' },
      { customer: customer3._id, restaurant: rest3._id, rating: 3, comment: 'Good food, but service was a bit slow during the dinner rush.' },
      { customer: customer4._id, restaurant: rest3._id, rating: 5, comment: 'Wonderful vegetarian options like paneer tikka masala and daal makhani!' },
    ]);

    // El Fuego Cantina (Average: ~3.7)
    await Review.create([
      { customer: customer1._id, restaurant: rest4._id, rating: 4, comment: 'Loved the street tacos and smoky mezcal margarita!' },
      { customer: customer2._id, restaurant: rest4._id, rating: 3, comment: 'Lively vibe and good music, but it gets very loud inside.' },
      { customer: customer3._id, restaurant: rest4._id, rating: 5, comment: 'Birria tacos with consommé are 10/10 must-try!' },
      { customer: customer4._id, restaurant: rest4._id, rating: 2, comment: 'Salsa was quite bland today and orders took 40 minutes.' },
    ]);

    // Note: Le Bistro Parisien left with 0 reviews to test "No ratings yet" requirement!

    console.log('[Seed] Database seeding completed successfully!');
    console.log('======================================================');
    console.log('Sample Logins:');
    console.log('  Admin:            admin@platform.com / Admin@1234');
    console.log('  Owner (Italian):  owner.mario@platform.com / Owner@1234');
    console.log('  Owner (Japanese): owner.sakura@platform.com / Owner@1234');
    console.log('  Owner (Indian):   owner.priya@platform.com / Owner@1234');
    console.log('  Customer 1:       customer.alex@example.com / Customer@1234');
    console.log('  Customer 2:       customer.sarah@example.com / Customer@1234');
    console.log('======================================================');
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    throw err;
  }
};

// If run directly via node seed.js
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
