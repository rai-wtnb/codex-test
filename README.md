# vibe-coding-test

This repository contains a sample Chrome extension named **YouTube Transcript Navigator**. The extension provides keyboard shortcuts for navigating YouTube video transcripts and automatically opens the transcript panel when you visit a video page.

## Features

### 🚀 Auto-Open Transcript

- **Automatically opens the transcript panel** when you navigate to a YouTube video page
- **Smart description expansion**: Automatically clicks "...more" buttons in video descriptions to reveal transcript options
- **Multi-language support**: Works with both English and Japanese YouTube interfaces
- **Intelligent retry system**: Attempts multiple strategies to locate and open the transcript panel

### ⌨️ Keyboard Navigation

- **A** – Jump to the previous transcript segment
- **S** – Replay the current transcript segment
- **D** – Jump to the next transcript segment

### 🔧 Smart Features

- **Active segment detection**: Automatically identifies the currently playing transcript segment
- **Smooth scrolling**: Transcript panel smoothly scrolls to keep active segments visible
- **Input field protection**: Keyboard shortcuts are disabled when typing in forms or text fields
- **SPA navigation support**: Works seamlessly with YouTube's single-page application navigation

## Installation

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable _Developer mode_.
3. Choose **Load unpacked** and select this extension folder.

## Usage

### Automatic Operation

1. **Navigate to any YouTube video** (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)
2. **Wait 2-3 seconds** - the extension will automatically:
   - Expand the video description if needed
   - Locate and click the transcript button
   - Open the transcript panel

### Manual Navigation

Once the transcript is visible, use these keyboard shortcuts:

- **A** – Previous segment
- **S** – Replay current segment
- **D** – Next segment

### Supported Video Types

- Videos with available transcripts (auto-generated or manually created)
- Both English and Japanese YouTube interfaces
- Videos with collapsed descriptions that contain transcript options

## Technical Details

The extension uses multiple fallback strategies to ensure reliable transcript access:

- **DOM mutation observers** for dynamic content detection
- **Multiple selector strategies** for different YouTube layout versions
- **Smart timing mechanisms** to handle YouTube's dynamic loading
- **Cross-language compatibility** for international users

## Troubleshooting

If the transcript doesn't open automatically:

1. **Check if transcript is available** - not all videos have transcripts
2. **Manually open transcript** once, then reload the page
3. **Ensure video description is expanded** - some transcripts are hidden behind "...more"
4. **Wait a few seconds** - the extension needs time to detect page changes

## Browser Compatibility

- **Chrome**: Fully supported (Manifest V3)
- **Edge**: Compatible with Chrome extensions
- **Other browsers**: Not tested
