import Expense from '@/models/Expense';
import connectToDatabase from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/utils/auth';

export async function GET(req: NextRequest) {
    await connectToDatabase();

    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');

    if (!start || !end) {
        return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }
    endDate.setHours(23, 59, 59, 999);


    const expenses = await Expense.find({
        userId,
        createdAt: {
            $gte: startDate,
            $lte: endDate,
        },
    }).sort({ createdAt: -1 });

    const income = expenses
        .filter(e => e.category === 'Income')
        .reduce((sum, e) => sum + e.amount, 0);
    const expense = expenses
        .filter(e => e.category === 'Expense')
        .reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({ income, expense, expenses });
}
