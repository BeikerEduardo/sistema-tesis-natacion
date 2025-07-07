// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error.message = message.join(', ');
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = Object.values(err.errors).map(val => val.message);
    error.message = message.join(', ');
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error.message = 'Resource not found or invalid relationship';
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
