const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

async function up() {
  try {
    console.log('Iniciando migración para añadir campos a la tabla Trainings...');
    
    // Verificar si la columna 'title' ya existe
    const titleExists = await sequelize.query(
      "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Trainings' AND COLUMN_NAME = 'title'",
      { type: QueryTypes.SELECT }
    );
    
    if (titleExists.length === 0) {
      await sequelize.query(`ALTER TABLE Trainings ADD COLUMN title VARCHAR(255) NULL`);
      console.log('Campo title añadido correctamente');
    } else {
      console.log('El campo title ya existe, saltando...');
    }
    
    // Verificar si la columna 'description' ya existe
    const descriptionExists = await sequelize.query(
      "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Trainings' AND COLUMN_NAME = 'description'",
      { type: QueryTypes.SELECT }
    );
    
    if (descriptionExists.length === 0) {
      await sequelize.query(`ALTER TABLE Trainings ADD COLUMN description TEXT NULL`);
      console.log('Campo description añadido correctamente');
    } else {
      console.log('El campo description ya existe, saltando...');
    }
    
    // Verificar si la columna 'location' ya existe
    const locationExists = await sequelize.query(
      "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Trainings' AND COLUMN_NAME = 'location'",
      { type: QueryTypes.SELECT }
    );
    
    if (locationExists.length === 0) {
      await sequelize.query(`ALTER TABLE Trainings ADD COLUMN location VARCHAR(255) NULL`);
      console.log('Campo location añadido correctamente');
    } else {
      console.log('El campo location ya existe, saltando...');
    }
    
    // Verificar si la columna 'status' ya existe
    const statusExists = await sequelize.query(
      "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Trainings' AND COLUMN_NAME = 'status'",
      { type: QueryTypes.SELECT }
    );
    
    if (statusExists.length === 0) {
      await sequelize.query(`ALTER TABLE Trainings ADD COLUMN status ENUM('scheduled', 'in-progress', 'completed', 'cancelled') DEFAULT 'scheduled'`);
      console.log('Campo status añadido correctamente');
    } else {
      console.log('El campo status ya existe, saltando...');
    }
    
    // Verificar si la columna 'startTime' ya existe
    const startTimeExists = await sequelize.query(
      "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Trainings' AND COLUMN_NAME = 'startTime'",
      { type: QueryTypes.SELECT }
    );
    
    if (startTimeExists.length === 0) {
      await sequelize.query(`ALTER TABLE Trainings ADD COLUMN startTime VARCHAR(10) NULL`);
      console.log('Campo startTime añadido correctamente');
    } else {
      console.log('El campo startTime ya existe, saltando...');
    }
    
    // Verificar si la columna 'endTime' ya existe
    const endTimeExists = await sequelize.query(
      "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Trainings' AND COLUMN_NAME = 'endTime'",
      { type: QueryTypes.SELECT }
    );
    
    if (endTimeExists.length === 0) {
      await sequelize.query(`ALTER TABLE Trainings ADD COLUMN endTime VARCHAR(10) NULL`);
      console.log('Campo endTime añadido correctamente');
    } else {
      console.log('El campo endTime ya existe, saltando...');
    }
    
    console.log('Migración completada exitosamente');
  } catch (error) {
    console.error('Error durante la migración:', error);
    throw error;
  }
}

async function down() {
  try {
    console.log('Revirtiendo migración...');
    
    await sequelize.query(`ALTER TABLE Trainings DROP COLUMN IF EXISTS title`);
    await sequelize.query(`ALTER TABLE Trainings DROP COLUMN IF EXISTS description`);
    await sequelize.query(`ALTER TABLE Trainings DROP COLUMN IF EXISTS location`);
    await sequelize.query(`ALTER TABLE Trainings DROP COLUMN IF EXISTS status`);
    await sequelize.query(`ALTER TABLE Trainings DROP COLUMN IF EXISTS startTime`);
    await sequelize.query(`ALTER TABLE Trainings DROP COLUMN IF EXISTS endTime`);
    
    console.log('Migración revertida exitosamente');
  } catch (error) {
    console.error('Error revirtiendo la migración:', error);
    throw error;
  }
}

module.exports = { up, down };
