import React, { createContext, useContext, useState } from 'react';

const QuestionSetContext = createContext();

export const QuestionSetProvider = ({ children }) => {
  const [questionSet, setQuestionSet] = useState(1);

  return (
    <QuestionSetContext.Provider value={{ questionSet, setQuestionSet }}>
      {children}
    </QuestionSetContext.Provider>
  );
};

export const useQuestionSetContext = () => useContext(QuestionSetContext);