import ResponseHandler from "../middlewares/error.middleware.js";
import Quiz from "../models/quizSchema.js";


export const createQuiz = async (req, res, next) => {
    const { name, difficultyLevel, questionList, answers, passingPercentage, isPublished } = req.body;
    const user = req.user;
    try {
        if (user.role !== "Employee" || user.role !== "Manager" )
            return next(new ResponseHandler("You can not use this resource", 400));

        const quiz = new Quiz({
            name, difficultyLevel, questionList, answers, passingPercentage, isPublished, createdBy: user._id,
        });
        const response = await quiz.save();
        return res.send("quiz successfully created");

    } catch (error) {
        return next(new ResponseHandler("Some error in creating quiz", error));
    }
} 
export const deleteQuiz = async () => {
    const quizId=req.params.id; 
    const user=req.user; 
    try {
      // Find the quiz by ID and delete it
      const deletedQuiz = await Quiz.findById(quizId);
   if(user._id!==deletedQuiz.createdBy){
    return next(new ResponseHandler("You can not delete this resource", 400));

   } 
   if(deletedQuiz.isPublished==true){
    return next(new ResponseHandler("You can not delete this resource", 400));

   } 
  
      if (!deletedQuiz) {
        // If quiz with the given ID is not found
        return { success: false, message: 'Quiz not found.' };
      }
  const response=await deleteQuiz.delete(); 
      return { success: true, message: 'Quiz deleted successfully.' };
    } catch (error) {
      // Handle any errors that occur during the deletion process
      console.error('Error deleting quiz:', error.message);
      return { success: false, message: 'Failed to delete quiz.' };
    }
  };

export const getQuizById = async (req, res) => {
    const quizId = req.params.id; // Assuming the quiz ID is passed as a route parameter
  
    try {
      // Find the quiz by ID
      const quiz = await Quiz.findById(quizId).populate('createdBy'); // Optionally populate createdBy field with username
  
      if (!quiz) {
        // If quiz with the given ID is not found
        return res.status(404).json({ success: false, message: 'Quiz not found.' });
      }
  
      // If quiz is found, return it
      return res.json({ success: true, quiz });
    } catch (error) {
      // Handle any errors that occur during the query
      console.error('Error fetching quiz:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to fetch quiz.' });
    }
  }; 
  export const get_My_Quiz = async (req, res) => {
  // Assuming the quiz ID is passed as a route parameter
  const user=req.user; 
    try {
      // Find the quiz by ID
      const quiz = await Quiz.find({createdBy:user._id}); // Optionally populate createdBy field with username
  
      if (!quiz) {
        // If quiz with the given ID is not found
        return res.status(404).json({ success: false, message: 'Quiz not found.' });
      }
  
      // If quiz is found, return it
      return res.json({ success: true, quiz });
    } catch (error) {
      // Handle any errors that occur during the query
      console.error('Error fetching quiz:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to fetch quiz.' });
    }
  }; 
  export const getAllQuizzes = async (req, res) => {
    try {
      const quizzes = await Quiz.find({isPublished:true}); 
  
      return res.json({ success: true, quizzes });
    } catch (error) {
      console.error('Error fetching quizzes:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to fetch quizzes.' });
    }
  };
  export const publishQuiz = async (req, res) => {
    const quizId = req.params.id; // Assuming the quiz ID is passed as a route parameter
  
    try {
      // Find the quiz by ID
      const quiz = await Quiz.findById(quizId); 
  
      if (!quiz) {
        // If quiz with the given ID is not found
        return res.status(404).json({ success: false, message: 'Quiz not found.' });
      }
        quiz.isPublished=true; 
    const result=    await quiz.save(); 
      // If quiz is found, return it
      return res.json({ success: true, result });
    } catch (error) {
      // Handle any errors that occur during the query
      console.error('Error fetching quiz:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to fetch quiz.' });
    }
  }; 
  
  

  export const updateQuiz = async (req, res, next) => {
    const user=req.user; 
    try {
      const quizId = req.params.id;
      const quiz = await Quiz.findById(quizId);
  
      if (!quiz) {
        return next(new ResponseHandler("Quiz not found!"));
      }
  
      if (user._id!== quiz.createdBy) {
      return next(new ResponseHandler("You are not authorized!"));
     
      }
  
      if (quiz.isPublished) {
        return next(new ResponseHandler("You cannot update, published Quiz!",405));
      }
        quiz.name = req.body.name;
      
      quiz.questionList = req.body.questionList;
      quiz.answers = req.body.answers;
      quiz.passingPercentage = req.body.passingPercentage;
      quiz.isPublicQuiz = req.body.isPublicQuiz;
      quiz.allowedUser = req.body.allowedUser;
  
      await quiz.save();
  
      res.send({
        status: "success",
        message: "Quiz updated successfully",resp
      })
    
     
    } catch (error) {
      next(error);
    }
  };
  