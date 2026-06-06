import { EventEmitter } from "events";

export enum BuildStep {
  INIT = "FACTORY",
  CLEAN = "CLEAN",
  COMPILE = "COMPILER",
  VALIDATE = "VALIDATOR",
  PREVIEW = "PREVIEW",
  PACKAGE = "PACKAGER",
  COMPLETE = "SUCCESS",
  ERROR = "ERROR"
}

export interface LogEntry {
  step: BuildStep;
  message: string;
  level: 'info' | 'warn' | 'error';
  timestamp: number;
}

class BuildLogger extends EventEmitter {
  public log(step: BuildStep, message: string, level: 'info' | 'warn' | 'error' = 'info') {
    const entry: LogEntry = { step, message, level, timestamp: Date.now() };
    // Still log to console for CLI users
    console.log(`[${step}] ${message}`);
    this.emit("progress", entry);
  }
}

export const buildLogger = new BuildLogger();