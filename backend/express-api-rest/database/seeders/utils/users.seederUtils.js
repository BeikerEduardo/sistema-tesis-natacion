const { User } = require("../../../models");


const createAppUsers = async () => {
    try {
        // Usar individualHooks: true para asegurar que el hook beforeCreate se ejecute para cada usuario
        // y así las contraseñas se hasheen correctamente
        const users = await User.bulkCreate([
            {
                name: 'Entrenador Principal',
                email: 'ent@app.com',
                password: 'ent123',
                role: 'coach'
            },
            {
                name: 'Entrenador Asistente',
                email: 'asis@app.com',
                password: 'asis123',
                role: 'coach'
            },
            {
                name: 'Administrador',
                email: 'admin@app.com',
                password: 'admin123',
                role: 'admin'
            }
        ], {
            individualHooks: true // Esto asegura que los hooks beforeCreate se ejecuten para cada registro
        });

        console.log('Usuarios creados con contraseñas hasheadas correctamente');
        return users;
    } catch (error) {
        console.error('Error creating users:', error);
        throw error;
    }
}

module.exports = {
    createAppUsers
};
