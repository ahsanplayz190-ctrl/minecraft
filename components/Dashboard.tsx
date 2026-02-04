
import React, { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ServerStatus, ConsoleLog, ServerConfig, SoftwareType } from '../types';
import Console from './Console';
import AIConsultant from './AIConsultant';

interface DashboardProps {
  config: ServerConfig;
  onUpdateConfig: (c: Partial<ServerConfig>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ config, onUpdateConfig }) => {
  const [status, setStatus] = useState<ServerStatus>(ServerStatus.OFFLINE);
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [uptime, setUptime] = useState(0);

  // Generate mock stats
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === ServerStatus.ONLINE) {
        setStats(prev => {
          const newData = [...prev, {
            time: new Date().toLocaleTimeString(),
            cpu: Math.random() * 20 + 5,
            ram: Math.random() * 15 + 30
          }].slice(-20);
          return newData;
        });
        setUptime(u => u + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [status]);

  const addLog = useCallback((message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO') => {
    const newLog: ConsoleLog = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const handleToggleServer = () => {
    if (status === ServerStatus.OFFLINE) {
      setStatus(ServerStatus.STARTING);
      addLog("Starting Vercel server instance...");
      addLog(`Preset detected: ${config.preset}`, "INFO");
      addLog("Allocating dedicated " + config.ram + "GB RAM node", "INFO");
      addLog("Pulling Docker image: " + config.software.toLowerCase() + ":" + config.version, "INFO");
      
      setTimeout(() => {
        addLog("Loading world components...", "INFO");
        addLog("Server software initialized on port 25565", "INFO");
        setStatus(ServerStatus.ONLINE);
        addLog("Done! (2.4s) For help, type \"help\"", "INFO");
      }, 3000);
    } else {
      setStatus(ServerStatus.STOPPING);
      addLog("Saving chunks...", "INFO");
      addLog("Closing socket listener", "INFO");
      setTimeout(() => {
        setStatus(ServerStatus.OFFLINE);
        setUptime(0);
        addLog("Server stopped successfully", "WARN");
      }, 1500);
    }
  };

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 h-full overflow-y-auto">
      {/* Sidebar Controls */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-zinc-400 uppercase text-xs tracking-widest">Power Control</h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              status === ServerStatus.ONLINE ? 'bg-green-500/20 text-green-400 border border-green-500/40' :
              status === ServerStatus.OFFLINE ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 animate-pulse'
            }`}>
              {status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleToggleServer}
              disabled={status === ServerStatus.STARTING || status === ServerStatus.STOPPING}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                status === ServerStatus.OFFLINE 
                  ? 'bg-white text-black hover:bg-zinc-200' 
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              <i className={`fas ${status === ServerStatus.OFFLINE ? 'fa-play' : 'fa-stop'}`}></i>
              {status === ServerStatus.OFFLINE ? 'Start' : 'Stop'}
            </button>
            <button 
              disabled={status !== ServerStatus.ONLINE}
              className="flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white rounded-lg font-bold text-sm transition-all"
            >
              <i className="fas fa-redo"></i>
              Restart
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-zinc-500 text-xs font-medium">Instance IP</span>
              <span className="text-white text-xs font-mono select-all cursor-pointer hover:text-indigo-400 transition-colors">
                {config.name.toLowerCase().replace(/\s+/g, '-')}.vercel.craft:25565
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-zinc-500 text-xs font-medium">Preset</span>
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-wide">{config.preset}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-zinc-500 text-xs font-medium">Uptime</span>
              <span className="text-white text-xs font-mono">{formatUptime(uptime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-xs font-medium">Players</span>
              <span className="text-white text-xs font-mono">0 / {config.maxPlayers}</span>
            </div>
          </div>
        </div>

        <AIConsultant onApplyConfig={(advice) => {
          onUpdateConfig({ software: advice.recommendedSoftware as SoftwareType });
          addLog("AI Architect applied new configurations.", "INFO");
        }} />
      </div>

      {/* Main Stats & Console */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4">CPU Usage (%)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="cpu" stroke="#8884d8" fillOpacity={1} fill="url(#colorCpu)" animationDuration={300} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4">Memory Usage (MB)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats}>
                  <defs>
                    <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="ram" stroke="#10b981" fillOpacity={1} fill="url(#colorRam)" animationDuration={300} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[400px]">
          <Console 
            logs={logs} 
            isOnline={status === ServerStatus.ONLINE}
            onSendCommand={(cmd) => addLog(`User executed: /${cmd}`, "INFO")}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
