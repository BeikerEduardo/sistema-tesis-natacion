const { sequelize } = require('./config');

// Initialize database
const initDb = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
    
    console.log('Initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
  finally{
    await sequelize.close();
    process.exit(0);
  }
};

// Run initialization
initDb();
