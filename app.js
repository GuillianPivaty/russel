require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/russell_port';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'russell_port_secret_2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/catways', require('./routes/catways'));
app.use('/catways', require('./routes/reservations'));
app.use('/users', require('./routes/users'));
app.use('/dashboard', require('./routes/dashboard'));

// Serve API docs
app.get('/api-docs', (req, res) => res.sendFile(require('path').join(__dirname, 'public/api-docs.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚢 Port de Russell en ligne : http://localhost:${PORT}`));

module.exports = app;
