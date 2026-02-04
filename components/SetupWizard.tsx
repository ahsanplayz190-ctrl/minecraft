
import React, { useState } from 'react';
import { SoftwareType, ServerConfig } from '../types';
import { SERVER_VERSIONS, REGIONS, RAM_OPTIONS } from '../constants';

interface SetupWizardProps {
  onComplete: (config: ServerConfig) => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ServerConfig>({
    name: 'My Vercel Server',
    software: SoftwareType.PAPER,
    version: '1.21.1',
    ram: 4,
    cpu: 2,
    region: 'us-east',
    motd: 'A VercelCraft Server',
    maxPlayers: 20
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Project Name</label>
              <input 
                type="text"
                value={config.name}
                onChange={(e) => setConfig({...config, name: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-white focus:ring-0 outline-none transition-all"
                placeholder="Ex: Survival SMP"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Region</label>
              <div className="grid grid-cols-2 gap-3">
                {REGIONS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setConfig({...config, region: r.id})}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${
                      config.region === r.id ? 'bg-zinc-800 border-zinc-600 ring-1 ring-zinc-500' : 'bg-black border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span>{r.flag}</span>
                    <span className="truncate">{r.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Software Type</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(SoftwareType).map(type => (
                  <button
                    key={type}
                    onClick={() => setConfig({...config, software: type})}
                    className={`p-3 rounded-lg border text-sm font-bold transition-all ${
                      config.software === type ? 'bg-zinc-800 border-zinc-600 ring-1 ring-zinc-500' : 'bg-black border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Version</label>
              <select 
                value={config.version}
                onChange={(e) => setConfig({...config, version: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-white outline-none"
              >
                {SERVER_VERSIONS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">RAM Allocation</label>
              <div className="flex flex-wrap gap-2">
                {RAM_OPTIONS.map(ram => (
                  <button
                    key={ram}
                    onClick={() => setConfig({...config, ram})}
                    className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${
                      config.ram === ram ? 'bg-white text-black border-white' : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {ram}GB
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Deployment Strategy</label>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 flex gap-4 items-start">
                <i className="fas fa-bolt text-indigo-400 mt-1"></i>
                <p className="text-xs text-indigo-300 leading-relaxed">
                  Your server will be deployed using Vercel's Global Edge Network. Assets will be mirrored across nodes for optimal latency. 
                  Persistent storage is backed by Vercel Blob Storage.
                </p>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl shadow-lg">
          <i className="fas fa-cube text-black text-xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold">New Instance</h1>
          <p className="text-zinc-500 text-sm">Step {step} of 3</p>
        </div>
      </div>

      <div className="mb-8 min-h-[200px]">
        {renderStep()}
      </div>

      <div className="flex justify-between items-center">
        {step > 1 ? (
          <button 
            onClick={prevStep}
            className="px-6 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Back
          </button>
        ) : <div />}
        
        <button 
          onClick={step === 3 ? () => onComplete(config) : nextStep}
          className="bg-white text-black px-8 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
        >
          {step === 3 ? 'Deploy Instance' : 'Continue'}
          <i className="fas fa-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default SetupWizard;
