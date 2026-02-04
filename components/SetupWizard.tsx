
import React, { useState, useRef, useEffect } from 'react';
import { SoftwareType, ServerConfig, ServerPreset } from '../types';
import { SERVER_VERSIONS, REGIONS, RAM_OPTIONS } from '../constants';

interface SetupWizardProps {
  onComplete: (config: ServerConfig) => void;
}

const PRESETS = [
  { id: ServerPreset.SURVIVAL, name: 'Survival', icon: 'fa-mountain', desc: 'The classic experience with hunger and health.' },
  { id: ServerPreset.CREATIVE, name: 'Creative', icon: 'fa-palette', desc: 'Unlimited resources and flight for builders.' },
  { id: ServerPreset.HARDCORE, name: 'Hardcore', icon: 'fa-skull', desc: 'One life. Maximum difficulty. No second chances.' },
  { id: ServerPreset.SKYBLOCK, name: 'Skyblock', icon: 'fa-cloud', desc: 'Survival on a floating island with limited items.' },
  { id: ServerPreset.MINIGAMES, name: 'Minigames', icon: 'fa-gamepad', desc: 'Hub for short, competitive gaming sessions.' },
  { id: ServerPreset.ANARCHY, name: 'Anarchy', icon: 'fa-biohazard', desc: 'No rules. No griefing protection. Pure chaos.' },
];

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [config, setConfig] = useState<ServerConfig>({
    name: 'My Vercel Server',
    software: SoftwareType.PAPER,
    version: '1.21.1',
    preset: ServerPreset.SURVIVAL,
    ram: 4,
    cpu: 2,
    region: 'us-east',
    motd: 'A VercelCraft Server',
    maxPlayers: 20
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const currentPreset = PRESETS.find(p => p.id === config.preset) || PRESETS[0];

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
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-zinc-400 focus:ring-0 outline-none transition-all placeholder-zinc-700"
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
                      config.region === r.id ? 'bg-zinc-900 border-zinc-600 ring-1 ring-zinc-500' : 'bg-black border-zinc-800 hover:border-zinc-700'
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
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Application Preset</label>
             
             <div className="relative" ref={dropdownRef}>
               {/* Custom Dropdown Trigger */}
               <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex items-center justify-between hover:border-zinc-700 transition-all group"
               >
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <i className={`fas ${currentPreset.icon} text-indigo-400`}></i>
                    </div>
                    <span className="font-medium text-zinc-100">{currentPreset.name}</span>
                 </div>
                 <i className={`fas fa-chevron-down text-xs text-zinc-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
               </button>

               {/* Dropdown Menu */}
               {isDropdownOpen && (
                 <div className="absolute top-full left-0 w-full mt-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-[60] overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                   <div className="max-h-80 overflow-y-auto p-1.5">
                     {PRESETS.map(p => (
                       <button
                         key={p.id}
                         onClick={() => {
                           setConfig({...config, preset: p.id});
                           setIsDropdownOpen(false);
                         }}
                         className={`w-full flex items-start gap-4 p-3 rounded-lg text-left transition-all ${
                           config.preset === p.id ? 'bg-indigo-500/10' : 'hover:bg-zinc-900'
                         }`}
                       >
                         <div className={`mt-1 w-8 h-8 rounded border flex items-center justify-center shrink-0 ${
                           config.preset === p.id ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-zinc-900 border-zinc-800'
                         }`}>
                           <i className={`fas ${p.icon} ${config.preset === p.id ? 'text-indigo-400' : 'text-zinc-500'}`}></i>
                         </div>
                         <div>
                           <div className="text-sm font-bold text-white leading-tight mb-0.5">{p.name}</div>
                           <div className="text-[11px] text-zinc-500 leading-tight">{p.desc}</div>
                         </div>
                         {config.preset === p.id && (
                           <i className="fas fa-check text-indigo-500 text-[10px] ml-auto mt-1.5"></i>
                         )}
                       </button>
                     ))}
                   </div>
                 </div>
               )}
             </div>

             <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg mt-8">
               <div className="flex items-center gap-2 mb-2">
                 <i className="fas fa-circle-info text-zinc-600 text-[10px]"></i>
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preset Summary</span>
               </div>
               <p className="text-xs text-zinc-400 leading-relaxed">
                 The <span className="text-indigo-400 font-bold">{currentPreset.name}</span> preset will pre-configure your <code className="text-indigo-300 font-mono">server.properties</code> and initial world generation rules for optimal performance.
               </p>
             </div>
          </div>
        );
      case 3:
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
                      config.software === type ? 'bg-zinc-900 border-zinc-600 ring-1 ring-zinc-500' : 'bg-black border-zinc-800 hover:border-zinc-700'
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
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-zinc-400 outline-none appearance-none cursor-pointer"
              >
                {SERVER_VERSIONS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        );
      case 4:
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
                  Your <span className="text-white font-bold">{config.preset}</span> server will be deployed using Vercel's Global Edge Network. 
                  Assets will be mirrored across nodes for optimal latency. 
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
          <p className="text-zinc-500 text-sm">Step {step} of 4</p>
        </div>
      </div>

      <div className="mb-8 min-h-[280px]">
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
          onClick={step === 4 ? () => onComplete(config) : nextStep}
          className="bg-white text-black px-8 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
        >
          {step === 4 ? 'Deploy Instance' : 'Continue'}
          <i className="fas fa-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default SetupWizard;
