# vibe-coding-test

This repository contains a sample Chrome extension named **YouTube Transcript Navigator**. The extension provides keyboard shortcuts for navigating YouTube video transcripts and automatically opens the transcript panel when you visit a video page.

## Features

### 🔧 Semi-Automatic Transcript Opening

- **Assists with transcript access**: Helps locate and open transcript panels after description expansion
- **Smart transcript detection**: Automatically finds transcript buttons in various YouTube layouts
- **Multi-language support**: Works with both English and Japanese YouTube interfaces
- **Intelligent retry system**: Attempts multiple strategies to locate transcript options

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

### Semi-Automatic Operation

1. **Navigate to any YouTube video** (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)
2. **Manually click "...more" in the video description** to expand it (if needed)
3. **The extension will then automatically**:
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

1. **Manually click "...more"** in the video description to expand it
2. **Check if transcript is available** - not all videos have transcripts
3. **Look for the transcript button** - it should appear after expanding the description
4. **Wait a few seconds** - the extension needs time to detect page changes

### Common Issues

- **Description needs manual expansion**: YouTube's dynamic loading sometimes requires manual clicking of the "...more" button
- **No transcript available**: Some videos don't have auto-generated or manual transcripts
- **Different layouts**: YouTube Premium and regular YouTube may have slightly different layouts

## Browser Compatibility

- **Chrome**: Fully supported (Manifest V3)
- **Edge**: Compatible with Chrome extensions
- **Other browsers**: Not tested
