
export enum ServerStatus {
  OFFLINE = 'OFFLINE',
  STARTING = 'STARTING',
  ONLINE = 'ONLINE',
  STOPPING = 'STOPPING',
  ERROR = 'ERROR'
}

export enum SoftwareType {
  VANILLA = 'Vanilla',
  PAPER = 'Paper',
  FORGE = 'Forge',
  FABRIC = 'Fabric',
  SPIGOT = 'Spigot'
}

export interface ServerConfig {
  name: string;
  software: SoftwareType;
  version: string;
  ram: number;
  cpu: number;
  region: string;
  motd: string;
  maxPlayers: number;
}

export interface ConsoleLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

export interface Player {
  id: string;
  name: string;
  ping: number;
  onlineSince: string;
}
