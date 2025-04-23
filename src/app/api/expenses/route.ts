import Expense from '@/models/Expense';
import connectToDatabase from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest, getUserIdFromToken } from '@/utils/auth';


export async function POST(req: NextRequest) {
    await connectToDatabase();
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const newExpense = await Expense.create({ ...body, userId });
    return NextResponse.json(newExpense);
}

export async function GET(req: NextRequest) {
    await connectToDatabase();
    const userId = getUserIdFromRequest(req);

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });
    const income = expenses.filter(e => e.category === 'Income').reduce((sum, e) => sum + e.amount, 0);
    const expense = expenses.filter(e => e.category === 'Expense').reduce((sum, e) => sum + e.amount, 0);
    return NextResponse.json({ income, expense, expenses });
}

export async function DELETE(req: NextRequest) {
    await connectToDatabase();
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = req.nextUrl.searchParams.get('id');
    const expense = await Expense.findById(id);
    if (!expense || expense.userId.toString() !== userId) {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }
    await Expense.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
}

