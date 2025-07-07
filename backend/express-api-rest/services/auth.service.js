
const { User } = require('../models/index');

class AuthService {

    static async register(userData) {
        try {

            const { name, email, password } = userData;

            // Check if user already exists
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                throw new Error('Email already registered');
            }

            // Create user
            const user = await User.create({
                name,
                email,
                password,
                role: 'coach'
            });

            // Create token
            const token = user.getSignedJwtToken();

            return {
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };
        } catch (err) {
            throw err;
        }

    }

    static async login(userData) {
        try {
            const { email, password } = userData;

            const user = await User.findOne({
                where: { email },
                attributes: ['id', 'name', 'email', 'password', 'role']
            });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isMatch = await user.matchPassword(password);

            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            // Create token
            const token = user.getSignedJwtToken();

            return {
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };

        } catch (err) {
            throw err;
        }
    }

    static async getMe(userId) {
        try {
            const user = await User.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'role']
            });

            return {
                success: true,
                data: user
            };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = AuthService;
