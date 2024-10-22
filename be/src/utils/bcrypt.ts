import * as bcrypt from 'bcrypt';

export function hashPassword(password: string) {
    const SALT_ROUNDS = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, SALT_ROUNDS);
}

export function comparePasswords(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
}