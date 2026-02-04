
import React, { useState, useEffect, useRef } from 'react';
import { ConsoleLog } from '../types';

interface ConsoleProps {
  logs: ConsoleLog[];
  onSendCommand: (cmd: string) => void;
  isOnline: boolean;
}

const Console: React.FC<ConsoleProps> = ({ logs, onSendCommand, isOnline }) => {
  const [command, setCommand] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onSendCommand(command);
      setCommand('');
    }
  };

  return (
    <div className="bg-[#050505] border border-zinc-800 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">System Console</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1 bg-black/40"
      >
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-3 leading-relaxed">
            <span className="text-zinc-600 whitespace-nowrap">[{log.timestamp}]</span>
            <span className={`font-bold whitespace-nowrap ${
              log.level === 'INFO' ? 'text-blue-400' : 
              log.level === 'WARN' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              [{log.level}]
            </span>
            <span className="text-zinc-300 break-all">{log.message}</span>
          </div>
        ))}
        {!isOnline && logs.length === 0 && (
          <div className="text-zinc-500 italic">Server is offline. Press START to initialize instance...</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-2 bg-zinc-900/30 border-t border-zinc-800 flex gap-2">
        <span className="text-zinc-500 font-mono pl-2 py-2">$</span>
        <input 
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type a command..."
          className="bg-transparent flex-1 border-none focus:ring-0 text-white font-mono placeholder-zinc-700"
          disabled={!isOnline}
        />
        <button 
          type="submit"
          disabled={!isOnline}
          className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs px-3 py-1 rounded transition-colors text-zinc-300 uppercase font-bold"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Console;
