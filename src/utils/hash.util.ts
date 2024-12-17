import * as bcrypt from 'bcrypt';

export async function generateHash(value: string): Promise<string> {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);

    return bcrypt.hash(value, salt);
}
