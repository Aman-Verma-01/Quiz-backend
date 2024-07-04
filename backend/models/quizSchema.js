import mongoose from "mongoose";


const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    negativeMark: {
        type: Number,
        required: true,
    },
    maxMarks: {
        type: Number,
        required: true,
    },
    passingMarks: {
        type: Number,
    },
    questions: [{questionSchema}],
    isPublished: {
        type: Boolean,
        default: false,
    },
    publishedDate:{
        type:Date
    },
    difficultyLevel: {
        type: String,
        enum:["Easy","Moderate","Hard"]
    },
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    },
    duration: {
        type: Number, // Duration in minutes
    },
    rules: {
        type: String,
    },
    enrolledUsers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['enrolled', 'started', 'completed'],
            default: 'enrolled'
        },
        score: {
            type: Number,
        }
    }],
    analytics: {
        totalAttempts: {
            type: Number,
            default: 0,
        },
        averageScore: {
            type: Number,
            default: 0,
        },
        passRate: {
            type: Number,
            default: 0,
        }
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
