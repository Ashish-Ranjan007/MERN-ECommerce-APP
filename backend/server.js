// Third-part modules
const dotenv = require('dotenv');

// Local modules
const app = require('./app');
const connectDatabase = require('./database/database');

// Handling uncaught exception
process.on('uncaughtException', (err) => {
	console.log(`Error: ${err.message}`);
	console.log('Shutting down the server due to uncaught exception');

	process.exit(1);
});

// Config
dotenv.config({ path: 'backend/config/config.env' });

// Connecting to database
connectDatabase();

// Spinning up the server
const server = app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// Unhandles promise rejection
process.on('unhandledRejection', (err) => {
	console.log(`Error: ${err.message}`);
	console.log('Shutting down the server due to unhandled promise rejection');

	server.close(() => {
		process.exit(1);
	});
});
