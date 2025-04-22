// utils/auth.ts
import { log } from 'console';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function getUserIdFromRequest(req: NextRequest): string | null {
    const authHeader = req.headers.get('authorization');
    console.log("aa ", authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("ddd ", decoded)
        return decoded.userId;
    } catch {
        return null;
    }
}

export function getUserIdFromToken(token: string): string | null {
    try {
        console.log("torkk ", token);

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded.userId;
    } catch {
        return null;
    }
}
