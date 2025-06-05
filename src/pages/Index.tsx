import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { MainApp } from "@/components/MainApp";

const Index = () => {
  const [currentView, setCurrentView] = useState<
    "landing" | "onboarding" | "app"
  >("landing");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Check for existing user data in localStorage
    const savedUserData = localStorage.getItem("memojo-user-data");
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setCurrentView("app");
    }
  }, []);

  const handleGetStarted = () => {
    // If user data exists, go directly to app
    if (userData) {
      setCurrentView("app");
    } else {
      setCurrentView("onboarding");
    }
  };

  const handleOnboardingComplete = (data: any) => {
    setUserData(data);
    // Save user data to localStorage
    localStorage.setItem("memojo-user-data", JSON.stringify(data));
    setCurrentView("app");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage onGetStarted={handleGetStarted} />;
      case "onboarding":
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
      case "app":
        return <MainApp userData={userData} />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return renderCurrentView();
};

export default Index;
