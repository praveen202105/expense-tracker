import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    await connectToDatabase();
    const { email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return NextResponse.json({ message: 'Email Already exists' }, { status: 400 });
        const user = await User.create({ email, password: hashedPassword });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return NextResponse.json({ message: 'User created', user, token });
    } catch (error) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}