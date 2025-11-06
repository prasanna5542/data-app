import React from 'react';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-3xl w-full bg-surface rounded-lg border border-border shadow-2xl p-8 text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to VFX Camera Log</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-6">Configuration Required</h2>
        
        <p className="text-lg text-text-secondary mb-8">
          To enable AI-powered features like sample data generation, you need to provide a Gemini API key.
        </p>

        <div className="text-left space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">For Local Development</h3>
            <p className="text-text-secondary">
              1. Create a file named <code className="bg-background text-primary-focus px-2 py-1 rounded">.env</code> in the root of your project.
            </p>
            <p className="text-text-secondary mt-2">
              2. Add the following line to the file, replacing <code className="bg-background text-primary-focus px-2 py-1 rounded">YOUR_API_KEY</code> with your actual key:
            </p>
            <pre className="bg-background border border-border rounded-md p-4 mt-2 overflow-x-auto">
              <code className="text-white">GEMINI_API_KEY=YOUR_API_KEY</code>
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">For Vercel Deployment</h3>
            <p className="text-text-secondary">
              1. Go to your project's dashboard on Vercel.
            </p>
            <p className="text-text-secondary mt-2">
              2. Navigate to <strong className="text-text-primary">Settings &gt; Environment Variables</strong>.
            </p>
            <p className="text-text-secondary mt-2">
              3. Add a new variable with the name <code className="bg-background text-primary-focus px-2 py-1 rounded">GEMINI_API_KEY</code> and paste your key as the value.
            </p>
             <p className="text-text-secondary mt-2">
              4. Redeploy your application for the changes to take effect.
            </p>
          </div>
        </div>

        <p className="text-text-secondary mt-10">
          You can get your Gemini API key from {' '}
          <a 
            href="https://ai.google.dev/gemini-api/docs/api-key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google AI Studio
          </a>.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
