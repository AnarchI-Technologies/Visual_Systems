declare module 'puppeteer-screen-recorder' {
    export class PuppeteerScreenRecorder {
        constructor(page: any, options?: any);
        start(savePath: string): Promise<void>;
        stop(): Promise<void>;
    }
}