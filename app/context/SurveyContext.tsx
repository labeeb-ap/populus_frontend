import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SurveyContextType {
  hasPendingSurveys: boolean;
  checkPendingSurveys: (surveys: any[], completed: Record<string, boolean>) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};

interface SurveyProviderProps {
  children: ReactNode;
}

export const SurveyProvider = ({ children }: SurveyProviderProps) => {
  const [hasPendingSurveys, setHasPendingSurveys] = useState(false);

  const checkPendingSurveys = (surveys: any[], completed: Record<string, boolean>) => {
    const pending = surveys.some(survey => !completed[survey._id]);
    setHasPendingSurveys(pending);
  };

  return (
    <SurveyContext.Provider value={{ hasPendingSurveys, checkPendingSurveys }}>
      {children}
    </SurveyContext.Provider>
  );
};

export default SurveyProvider;