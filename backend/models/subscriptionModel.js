import mongoose from 'mongoose';

const { Schema } = mongoose;

const subscriptionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        enum: ['8-month', 'annual'],
        required: true
    },
    stripeSubscriptionId: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        required: true,
        default: 'inactive'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

subscriptionSchema.methods.isExpired = function () {
    return new Date() > this.endDate;  // Compare current date to the subscription's end date
};

// Middleware to update the `updatedAt` field before saving
subscriptionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
