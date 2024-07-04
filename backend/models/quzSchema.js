import mongoose from "mongoose";

const schema = mongoose.Schema;
//schema
const quizSchema = new schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    difficultyLevel: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    questionList:[
      {
        questionNumber: Number,
        question: String,
        options: {},
      },
    ],
    answers: {},
    passingPercentage: {
      type: Number,
      required: true
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    attemptedUsers: [        //Stores an array of objects users who have attempted the quiz
        {type:mongoose.Types.ObjectId,
        ref:"user"}

    ]
    
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;