// lib/passport.js
import bcrypt from 'bcryptjs';
import LocalStrategy from 'passport-local';
import User from '@/models/user';

export const authOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
};

export const getStrategy = () => {
    return new LocalStrategy(authOptions, async (req, email, password, done) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Incorrect email or password' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return done(null, false, { message: 'Incorrect email or password' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });
};

export const serializeUser = (user, done) => {
    done(null, user.id);
};

export const deserializeUser = async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
};