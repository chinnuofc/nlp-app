// Fix: Replaced malformed file content with a functional React component.
// This resolves the module resolution error in index.tsx and syntax errors in App.tsx.
import React, { useState, useRef, useEffect } from 'react';
import { classifySmsMessage } from './services/geminiService';
import { ClassificationResult, HistoryEntry, Classification } from './types';
import { ProbabilityDonut } from './components/ProbabilityDonut';
import { InfoTooltip } from './components/InfoTooltip';


// --- SVG Icons ---
const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const ClipboardCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


function App() {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  // Fix: Changed useRef type from HTMLElement to HTMLDivElement to match the element it's referencing.
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);
    setIsCopied(false);

    try {
      const classificationResult = await classifySmsMessage(message);
      setResult(classificationResult);
      setHistory(prevHistory => [
        { ...classificationResult, message, id: crypto.randomUUID() },
        ...prevHistory,
      ]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessage('');
    setResult(null);
    setError(null);
    setIsCopied(false);
  };
  
  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleShare = async () => {
    if (!result) return;
    const summary = `SMS Message: "${message}"\nResult: ${result.classification}\nConfidence: ${Math.round(result.probability * 100)}%`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SMS Classification Result',
          text: summary,
        });
        return;
      } catch (err) {
        console.error('Error using Web Share API:', err);
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      alert('Failed to copy result to clipboard.');
    }
  };


  return (
    <div className="min-h-screen font-sans antialiased">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-8 transition-all">
          <header className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3">
              <ShieldCheckIcon/>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">SMS Spam Classifier</h1>
            <p className="text-gray-500 mt-2">
              Use AI to instantly check if a message is spam or not.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-2">
              <label htmlFor="message" className="text-lg font-semibold text-gray-700">Message Content</label>
              <div className="ml-2">
                <InfoTooltip />
              </div>
            </div>
            <textarea
              id="message"
              className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out shadow-sm disabled:bg-gray-100"
              placeholder="e.g., 'Congratulations! You've won a $1000 gift card...'"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading || !!result}
            />
             <div className="mt-4">
                {!result ? (
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={isLoading || !message.trim()}
                    >
                        {isLoading ? <><SpinnerIcon/> Classifying...</> : 'Classify Message'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Check Another Message
                    </button>
                )}
            </div>
          </form>

          <div ref={resultRef}>
            {error && (
              <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md animate-fadeInUp" role="alert">
                <p><span className="font-bold">Error:</span> {error}</p>
              </div>
            )}

            {result && !isLoading && (
              <section className="mt-8 text-center animate-fadeInUp">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Classification Result</h2>
                <div className="flex flex-col items-center">
                  <ProbabilityDonut probability={result.probability} classification={result.classification} />
                  <p className={`mt-4 text-4xl font-bold tracking-tight ${result.classification === Classification.Spam ? 'text-red-500' : 'text-green-500'}`}>
                    {result.classification}
                  </p>
                </div>
                <div className="mt-6">
                   <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
                    >
                        {isCopied ? <><ClipboardCheckIcon/> Copied!</> : <><ShareIcon/> Share Result</>}
                    </button>
                </div>
              </section>
            )}
          </div>

          {history.length > 0 && (
            <section className="mt-12 animate-fadeInUp">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">History</h2>
                <button 
                  onClick={handleClearHistory} 
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors duration-200"
                  aria-label="Clear all history"
                >
                  <TrashIcon/> Clear History
                </button>
              </div>
              <ul className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                {history.map((entry) => (
                  <li key={entry.id} className="p-4 border rounded-lg bg-slate-50/50">
                    <p className="text-gray-600 italic line-clamp-2">"{entry.message}"</p>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className={`px-2.5 py-0.5 text-sm font-bold rounded-full ${entry.classification === Classification.Spam ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {entry.classification}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {Math.round(entry.probability * 100)}% Confident
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
