// Third-part modules
const dotenv = require('dotenv');

// Local modules
const app = require('./app');
const connectDatabase = require('./database/database');

// Config
dotenv.config({ path: 'backend/config/config.env' });

// Connecting to database
connectDatabase();

// Spinning up the server
app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
