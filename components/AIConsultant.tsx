
import React, { useState } from 'react';
import { getAIConfigAdvice } from '../services/geminiService';

interface AIConsultantProps {
  onApplyConfig: (config: any) => void;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ onApplyConfig }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const data = await getAIConfigAdvice(prompt);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
          <i className="fas fa-robot text-white"></i>
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">VercelCraft AI Architect</h3>
          <p className="text-xs text-indigo-300">Intelligent Server Provisioning</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {result ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-black/40 p-4 rounded-lg border border-indigo-500/20">
              <h4 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-wide">Analysis Result</h4>
              <p className="text-zinc-300 text-sm mb-4">I recommend running <span className="text-white font-bold">{result.recommendedSoftware}</span> for your goal.</p>
              
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-500">OPTIMIZED PLUGINS:</p>
                {result.plugins.map((p: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-green-500">●</span>
                    <div>
                      <span className="text-zinc-200 font-semibold">{p.name}</span>: <span className="text-zinc-400">{p.purpose}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-lg">
              <p className="text-xs italic text-indigo-200">" {result.proTip} "</p>
            </div>
            
            <button 
              onClick={() => {
                onApplyConfig(result);
                setResult(null);
                setPrompt('');
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              Apply Recommended Settings
            </button>
            <button 
              onClick={() => setResult(null)}
              className="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Ask something else
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center px-4">
            <i className="fas fa-terminal text-indigo-500/50 text-4xl mb-4"></i>
            <p className="text-zinc-400 text-sm mb-2">How can I help you today?</p>
            <p className="text-zinc-600 text-xs">"I want to create a lag-free 1.20 survival server for 20 players with an economy system."</p>
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your server dream..."
          className="w-full bg-black/40 border border-zinc-800 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none h-24"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !prompt.trim()}
          className="absolute bottom-3 right-3 p-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-800 text-white rounded-lg transition-all"
        >
          {loading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-paper-plane"></i>}
        </button>
      </div>
    </div>
  );
};

export default AIConsultant;
