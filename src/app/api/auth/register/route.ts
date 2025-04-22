import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    await connectToDatabase();
    const { email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return NextResponse.json({ error: 'Email exists' }, { status: 400 });
        const user = await User.create({ email, password: hashedPassword });
        return NextResponse.json({ message: 'User created', user });
    } catch (error) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}