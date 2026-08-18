---
title: Building an AI Viral Video Generator — Svelte 5 Runes, Gemini Gateway & Audio Sync
date: 2026-08-16
description: A deep engineering breakdown of Brainrot Studio — how I built a 5-stage AI creation wizard, reactive canvas with Svelte 5 runes, and a Python TTS audio pipeline.
tags: [fullstack, ai, svelte, python, video-processing]
---

## The Origin Story

Scroll through TikTok or YouTube Shorts for five minutes and you'll spot them: vertical videos featuring AI voiceovers, dynamic auto-captions, layered background gameplay, and animated character avatars. They generate millions of views, but creating one manually takes hours of editing in Premiere or CapCut.

I built **Brainrot Studio** to automate this entire pipeline — taking a single prompt idea and outputting a fully assembled, narrated, captioned vertical Short in under two minutes.

Here is how the system is architected from frontend runes to backend audio duration synchronization.

```
Prompt / Topic
      ↓
[Stage 1: Topic & Script Generation] → Gemini / Ollama Gateway
      ↓
[Stage 2: Voice & Audio Synthesis]  → Edge TTS / Kokoro API
      ↓
[Stage 3: Captions & Alignment]      → Whisper Millisecond Timestamps
      ↓
[Stage 4: Scene & Asset Layering]   → Svelte 5 Reactive Timeline
      ↓
[Stage 5: Rendering Engine]         → FFmpeg Transcoding Pipeline
```

## Svelte 5 Runes for Studio Timeline Canvas

The studio canvas requires real-time scrubbing, drag-and-drop layer reordering, and sub-frame video previewing. Svelte 5 runes (`$state`, `$derived`, `$effect`) made complex timeline state management remarkably clean compared to legacy stores.

Here is how the reactive clip duration and scrubber position are synchronized:

```svelte
<script lang="ts">
  type SceneTrack = {
    id: string;
    startTime: number; // milliseconds
    duration: number;
    text: string;
    audioUrl?: string;
  };

  let { tracks = $bindable([]), currentTime = $bindable(0) } = $props<{
    tracks: SceneTrack[];
    currentTime: number;
  }>();

  // Derived total duration recalculated automatically whenever tracks mutate
  let totalDuration = $derived(
    tracks.reduce((max, t) => Math.max(max, t.startTime + t.duration), 0)
  );

  let activeTrack = $derived(
    tracks.find(t => currentTime >= t.startTime && currentTime < t.startTime + t.duration)
  );

  function handleSeek(event: MouseEvent, containerWidth: number) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / containerWidth));
    currentTime = Math.round(percentage * totalDuration);
  }
</script>

<div class="timeline-track-container" onclick={(e) => handleSeek(e, 800)}>
  <div
    class="scrubber-head"
    style="left: {(currentTime / (totalDuration || 1)) * 100}%"
  ></div>
  {#each tracks as track (track.id)}
    <div
      class="track-segment"
      class:active={activeTrack?.id === track.id}
      style="left: {(track.startTime / totalDuration) * 100}%; width: {(track.duration / totalDuration) * 100}%"
    >
      <span class="track-label">{track.text}</span>
    </div>
  {/each}
</div>
```

## Python TTS Audio Pipeline & Precise Duration Matching

One of the trickiest parts of automated video generation is ensuring spoken voice audio perfectly matches scene durations and caption timestamps. If text reading speed varies, background video loops drift out of sync.

In the FastAPI backend, I implemented a Whisper alignment wrapper that inspects the generated `.wav` file duration and returns exact word-level timestamp offsets:

```python
import asyncio
from pathlib import Path
import edge_tts
import whisper

class AudioSynthesisEngine:
    def __init__(self, voice_model: str = "en-US-ChristopherNeural"):
        self.voice = voice_model
        self.whisper_model = whisper.load_model("base")

    async def generate_narration(self, text: str, output_path: Path) -> dict:
        communicate = edge_tts.Communicate(text, self.voice)
        await communicate.save(str(output_path))

        # Transcribe with Whisper to extract word-level timings
        result = self.whisper_model.transcribe(
            str(output_path),
            word_timestamps=True
        )

        word_timings = []
        for segment in result["segments"]:
            for word_info in segment.get("words", []):
                word_timings.append({
                    "word": word_info["word"].strip(),
                    "start": int(word_info["start"] * 1000), # convert to ms
                    "end": int(word_info["end"] * 1000)
                })

        duration_ms = int(result["segments"][-1]["end"] * 1000) if result["segments"] else 0

        return {
            "audio_file": str(output_path),
            "duration_ms": duration_ms,
            "word_timings": word_timings
        }
```

## Lessons Learned

1. **Reactive UI vs Heavy Video Editors**: You don't need a heavy WebGL canvas for timeline assembly. Svelte 5 reactivity bound to CSS absolute percentages provides 60fps scrubbing with near-zero memory footprint.
2. **Audio-First Driven Timelines**: Always calculate scene lengths from spoken audio files, not arbitrary estimates. Once voice tracks are generated, locked timeline keyframes align effortlessly.

Brainrot Studio is open source in my 200-projects repository!
