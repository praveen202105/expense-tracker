import mongoose, { Schema, models } from 'mongoose';

const expenseSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: { type: String, enum: ['Income', 'Expense'], required: true },
    description: String,
    createdAt: { type: Date, default: Date.now },
});

export default models.Expense || mongoose.model('Expense', expenseSchema);
