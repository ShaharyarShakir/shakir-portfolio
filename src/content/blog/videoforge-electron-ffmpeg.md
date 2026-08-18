---
title: VideoForge — Building a Desktop Media Suite with Electron, yt-dlp & FFmpeg
date: 2026-07-12
description: Architecture of VideoForge media tool — managing cross-process IPC communication, stream downloading via yt-dlp, and non-blocking FFmpeg transcoding.
tags: [desktop, electron, react, ffmpeg, typescript]
---

## Why Build a Desktop Media App?

Browser-based video processing tools suffer from harsh memory limits, slow upload pipelines, and sandbox restrictions. When working with gigabytes of raw 4K footage or batch downloading media queues, a native desktop app powered by local system binaries is exponentially faster and more capable.

I built **VideoForge** as an Electron desktop suite combining **yt-dlp** streaming downloads, **FFmpeg** hardware-accelerated encoding, and a React UI.

```
┌───────────────────────────────────────────────────────────┐
│              Electron Renderer Process (React UI)         │
└─────────────────────────────┬─────────────────────────────┘
                              │ IPC (preload contextBridge)
┌─────────────────────────────▼─────────────────────────────┐
│                 Electron Main Process (Node.js)           │
│                                                           │
│  ├── Spawn yt-dlp process  ─► Stream Progress Parsing     │
│  └── Spawn FFmpeg binary   ─► H.264 / HEVC Hardware Transcode
└───────────────────────────────────────────────────────────┘
```

## Secure IPC via Preload `contextBridge`

In Electron, enabling `nodeIntegration` in renderer windows is a severe security risk. VideoForge isolates the renderer process completely, exposing typed API methods via a preload script:

```ts
// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  downloadMedia: (url: string, format: string) =>
    ipcRenderer.invoke('media:download', { url, format }),

  onDownloadProgress: (callback: (progress: number) => void) => {
    const listener = (_event: any, value: number) => callback(value);
    ipcRenderer.on('media:progress', listener);
    return () => ipcRenderer.removeListener('media:progress', listener);
  },

  transcodeVideo: (options: { inputPath: string; codec: string }) =>
    ipcRenderer.invoke('media:transcode', options)
});
```

## Managing Native Binary Subprocesses & Stream Progress

In the main Node.js process, spawning child processes to run `yt-dlp` or `ffmpeg` requires stdout stream parsing to report realtime progress to the UI without blocking the main event loop:

```ts
// main.ts
import { ipcMain, BrowserWindow } from 'electron';
import { spawn } from 'child_process';
import path from 'path';

ipcMain.handle('media:download', async (event, { url, format }) => {
  const mainWindow = BrowserWindow.fromWebContents(event.sender);
  
  return new Promise((resolve, reject) => {
    // Spawn packaged yt-dlp binary
    const ytdlpPath = path.join(__dirname, '../bin/yt-dlp');
    const child = spawn(ytdlpPath, [
      '--newline',
      '-f', format || 'bestvideo+bestaudio/best',
      '-o', '%(title)s.%(ext)s',
      url
    ]);

    child.stdout.on('data', (data: Buffer) => {
      const line = data.toString();
      // Regex match yt-dlp progress: "[download] 45.2% of ~10.50MiB at 2.10MiB/s"
      const match = line.match(/\[download\]\s+(\d+\.\d+)%/);
      if (match && mainWindow) {
        const percent = parseFloat(match[1]);
        mainWindow.webContents.send('media:progress', percent);
      }
    });

    child.on('close', (code) => {
      if (code === 0) resolve({ success: true });
      else reject(new Error(`yt-dlp exited with code ${code}`));
    });
  });
});
```

## Desktop Transcoding Lessons

1. **Hardware Acceleration**: Always detect system GPU support (`nvenc` for NVIDIA, `videotoolbox` for macOS) before spawning FFmpeg to drastically reduce export times.
2. **Process Cleanup**: Always hook `app.on('before-quit')` to kill orphaned child processes if the user closes the app mid-download.
