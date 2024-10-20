import React, { useState, useEffect } from "react";
import interviewQuestions from "../Assets/Questions.json";

const RandomInterviewQuestionDisplay = ({ onQuestionEnd }) => {
  const [currentQuestion, setCurrentQuestion] = useState({
    category: "",
    question: "",
  });
  const [showQuestion, setShowQuestion] = useState(true);

  const getRandomQuestion = () => {
    const categories = Object.keys(interviewQuestions);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const questions = interviewQuestions[randomCategory];
    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    return { category: randomCategory, question: randomQuestion };
  };

  useEffect(() => {
    const showQuestionDuration = 120000; // 2 minutes
    const questionTimer = setTimeout(() => {
      setShowQuestion(false);
      if (onQuestionEnd) {
        onQuestionEnd();
      }
    }, showQuestionDuration);

    // Set initial question
    setCurrentQuestion(getRandomQuestion());

    return () => clearTimeout(questionTimer);
  }, [onQuestionEnd]);

  if (!currentQuestion.question || !showQuestion) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-blue-500 text-black p-4 transition-opacity duration-500 ease-in-out"
      style={{ opacity: showQuestion ? 1 : 0 }}
    >
      <h3 className="text-lg font-semibold mb-2">{currentQuestion.category}</h3>
      <p className="text-xl font-bold">{currentQuestion.question}</p>
    </div>
  );
};

export default RandomInterviewQuestionDisplay;
