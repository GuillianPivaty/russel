require('dotenv').config();
const mongoose = require('mongoose');
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');
const User = require('./models/User');
const catways = require('./data/catways.json');
const reservations = require('./data/reservations.json');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/russell_port';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connecté à MongoDB');

  // Import catways
  await Catway.deleteMany({});
  await Catway.insertMany(catways);
  console.log(`✅ ${catways.length} catways importés`);

  // Import reservations
  await Reservation.deleteMany({});
  await Reservation.insertMany(reservations);
  console.log(`✅ ${reservations.length} réservations importées`);

  // Create admin user
  await User.deleteMany({});
  await User.create({
    username: 'admin',
    email: 'admin@port-russell.fr',
    password: 'admin123'
  });
  console.log('✅ Utilisateur admin créé : admin@port-russell.fr / admin123');

  await mongoose.disconnect();
  console.log('🚢 Base de données initialisée avec succès !');
}

seed().catch(console.error);
