import React, { useState, useEffect } from "react";
import ChatLayout from "./ChatLayout";

const Home = () => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user has previously set up the application
    const hasSetupPin = localStorage.getItem("hasSetupPin");
    if (hasSetupPin) {
      setIsFirstTimeUser(false);
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-lg font-medium">
            Loading your chat application...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <ChatLayout />
    </div>
  );
};

export default Home;
