export const getOpenAIApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OpenAI API key not found in environment variables. Please add VITE_OPENAI_API_KEY to your .env file."
    );
  }
  return apiKey;
};
