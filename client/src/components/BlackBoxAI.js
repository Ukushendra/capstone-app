import React, { useState } from 'react';
import axios from 'axios';
import GlassCard from './GlassCard';

const BlackBoxAI = ({ initialInput = '', placeholder = 'Describe your health concern or enter BMI data...', onResult }) => {
  const [input, setInput] = useState(initialInput);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setProcessing(true);
    setError('');
    setResult('');

    try {
      const res = await axios.post(
  `${process.env.REACT_APP_API}/api/health-ai/chat`,
  { message: input }
);
      setResult(res.data.response);
      onResult?.(res.data.response);
    } catch (err) {
      setError('Processing failed. Try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GlassCard className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent text-center mb-4">
            🔮 Black Box AI
          </h2>
          <p className="text-gray-400 text-center text-sm">Enter query → Watch magic → Get insights</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="w-full p-6 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 text-lg font-medium text-white placeholder-gray-500 transition-all duration-300 focus:scale-105 neon-glow"
            disabled={processing}
          />
          <button
            type="submit"
            disabled={!input.trim() || processing}
            className="w-full p-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-neon-pulse hover:shadow-neon-glow hover:scale-105 active:scale-95 disabled:opacity-50 transition-all duration-300 glass-hover relative overflow-hidden"
          >
            {processing ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
                <span>Scanning...</span>
              </div>
            ) : (
              'Activate Black Box'
            )}
          </button>
        </form>

        {processing && (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-center gap-2 text-indigo-400">
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
            </div>
            <div className="h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-scan mx-auto rounded-full" />
          </div>
        )}

        {result && (
          <div className="p-6 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 animate-slide-up">
            <h3 className="font-bold text-indigo-300 mb-3 flex items-center gap-2">
              <span>✨</span> Insights Generated
            </h3>
            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{result}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/20 border border-rose-500/30 rounded-2xl text-rose-300 text-center">
            {error}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default BlackBoxAI;
