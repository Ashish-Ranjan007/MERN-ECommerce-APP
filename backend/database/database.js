const mongoose = require('mongoose');

const connectDatabase = () => {
	mongoose
		.connect(process.env.DB_URI)
		.then((data) => {
			console.log('Database Connected');
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = connectDatabase;
