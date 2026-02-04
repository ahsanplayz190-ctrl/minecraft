
import React, { useState } from 'react';
import SetupWizard from './components/SetupWizard';
import Dashboard from './components/Dashboard';
import { ServerConfig } from './types';

const App: React.FC = () => {
  const [provisioned, setProvisioned] = useState(false);
  const [serverConfig, setServerConfig] = useState<ServerConfig | null>(null);

  const handleDeployment = (config: ServerConfig) => {
    setServerConfig(config);
    setProvisioned(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <header className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <svg viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="black"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">VercelCraft</span>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Documentation</a>
            <a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Pricing</a>
            <a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Marketplace</a>
          </nav>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-zinc-700 cursor-pointer"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-black">
        {!provisioned ? (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                Minecraft Infrastructure <br />for the modern web.
              </h1>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                Deploy high-performance Minecraft servers in seconds with Vercel's global edge infrastructure. 
                AI-driven optimization, real-time metrics, and instant scaling.
              </p>
            </div>
            <SetupWizard onComplete={handleDeployment} />
            
            <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <i className="fas fa-microchip text-3xl text-zinc-500 mb-4"></i>
                <h3 className="font-bold mb-2">Edge Computing</h3>
                <p className="text-sm text-zinc-500">Servers are automatically distributed to the node closest to your players.</p>
              </div>
              <div className="p-6">
                <i className="fas fa-brain text-3xl text-zinc-500 mb-4"></i>
                <h3 className="font-bold mb-2">AI-Optimized</h3>
                <p className="text-sm text-zinc-500">Gemini-powered consultants help you fine-tune your server.properties and plugins.</p>
              </div>
              <div className="p-6">
                <i className="fas fa-shield-halved text-3xl text-zinc-500 mb-4"></i>
                <h3 className="font-bold mb-2">DDoS Protection</h3>
                <p className="text-sm text-zinc-500">Enterprise-grade protection at no extra cost, powered by Vercel Shield.</p>
              </div>
            </div>
          </div>
        ) : (
          <Dashboard 
            config={serverConfig!} 
            onUpdateConfig={(partial) => setServerConfig(prev => prev ? ({...prev, ...partial}) : null)}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="py-8 border-t border-zinc-900 bg-zinc-950 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-zinc-600 text-xs font-medium">
            &copy; 2024 VercelCraft Inc. All rights reserved. Built with Gemini AI.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">Status</a>
            <a href="#" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">Privacy</a>
            <a href="#" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
