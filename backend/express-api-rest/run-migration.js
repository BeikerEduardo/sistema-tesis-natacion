const { up } = require('./migrations/add_training_fields');

// Ejecutar la migración
async function runMigration() {
  try {
    console.log('Iniciando migración...');
    await up();
    console.log('Migración completada con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar la migración:', error);
    process.exit(1);
  }
}

runMigration();
