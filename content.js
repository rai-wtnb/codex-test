// content.js
console.log("YouTube Transcript Navigator content script loaded.");

const TRANSCRIPT_SEGMENT_SELECTOR = 'ytd-transcript-segment-renderer';
const ACTIVE_TRANSCRIPT_SEGMENT_CLASS = 'active'; // This class might change, needs verification
const TRANSCRIPT_PANEL_SELECTOR = 'ytd-transcript-renderer'; // Selector for the transcript panel itself
const PLAYER_PROGRESS_TIME_SELECTOR = '.ytp-time-current'; // Selector for the current time display of the player

// Function to get all transcript segments
function getTranscriptSegments() {
  // First, check if the transcript panel is open and visible
  const transcriptPanel = document.querySelector(TRANSCRIPT_PANEL_SELECTOR);
  if (!transcriptPanel || transcriptPanel.hidden) {
    console.log("Transcript panel is not open or visible.");
    // Optionally, we could try to open it here, but that's more complex.
    // For now, we'll just operate if it's already open.
    return [];
  }
  return Array.from(transcriptPanel.querySelectorAll(TRANSCRIPT_SEGMENT_SELECTOR));
}

// Function to find the currently active transcript segment
function findCurrentActiveSegment(segments) {
  if (!segments || segments.length === 0) return null;
  // YouTube usually adds a class like 'active' or 'cue' to the currently playing segment
  // Let's try a few common ones or check for attributes.
  // The most reliable way is often to check which segment's timestamp matches the video's current time.
  // However, directly clicking segments often makes them 'active' visually.

  // First, try to find by a common 'active' class.
  // Note: YouTube's actual class for active/current cue might be different,
  // e.g., 'yt-core-attributed-string--active-cue', 'yt-formatted-string.active'
  // or within a child element 'yt-formatted-string[is-active-cue]'
  let activeSegment = segments.find(segment =>
    segment.classList.contains(ACTIVE_TRANSCRIPT_SEGMENT_CLASS) || // Direct class
    segment.classList.contains('yt-core-attributed-string--active-cue') || // New class
    segment.querySelector('.yt-core-attributed-string--active-cue') || // Child with new class
    segment.classList.contains('yt-formatted-string[is-active-cue]') // Another possible class
  );

  if (activeSegment) return activeSegment;

  // Fallback: If no class-based active segment is found,
  // try to find the segment whose time range includes the current video time.
  // This is more robust but requires parsing timestamps from each segment.
  try {
    const videoPlayer = document.querySelector('.html5-main-video');
    if (!videoPlayer) return null;
    const currentTime = videoPlayer.currentTime; // Time in seconds

    for (const segment of segments) {
      const startTimeText = segment.querySelector('.segment-timestamp')?.textContent.trim();
      if (!startTimeText) continue;

      const startTime = parseTimestampToSeconds(startTimeText);
      // We need a way to determine the end time of the segment.
      // This might require looking at the start time of the *next* segment
      // or assuming a typical duration if not available.
      // For simplicity, we'll consider a segment "active" if the video's current time
      // is at or after its start time and before the next segment's start time.

      const segmentIndex = segments.indexOf(segment);
      let endTime;
      if (segmentIndex < segments.length - 1) {
        const nextStartTimeText = segments[segmentIndex + 1].querySelector('.segment-timestamp')?.textContent.trim();
        if (nextStartTimeText) {
          endTime = parseTimestampToSeconds(nextStartTimeText);
        }
      } else {
        // For the last segment, we can assume it's active until the video ends or for a few seconds.
        endTime = startTime + 10; // Default duration of 10s for the last segment.
      }

      if (currentTime >= startTime && (endTime === undefined || currentTime < endTime)) {
        // console.log(`Fallback: Active segment found by time: ${startTimeText}`);
        return segment;
      }
    }
  } catch (e) {
    console.error("Error finding active segment by time:", e);
  }

  // If still no active segment, return the first one as a default if user wants to navigate.
  return segments.length > 0 ? segments[0] : null;
}

// Helper function to parse HH:MM:SS or MM:SS timestamp to seconds
function parseTimestampToSeconds(timestamp) {
  const parts = timestamp.split(':').map(Number);
  let seconds = 0;
  if (parts.length === 3) { // HH:MM:SS
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) { // MM:SS
    seconds = parts[0] * 60 + parts[1];
  } else if (parts.length === 1) { // SS
    seconds = parts[0];
  }
  return seconds;
}

// Function to scroll the transcript panel to make the segment visible
function scrollSegmentIntoView(segment) {
  if (segment && typeof segment.scrollIntoView === 'function') {
    segment.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Function to go to the previous transcript segment
function goToPreviousTranscript() {
  const segments = getTranscriptSegments();
  if (segments.length === 0) {
    console.log("No transcript segments found to go to previous.");
    return;
  }

  let currentActive = findCurrentActiveSegment(segments);
  let currentIndex = currentActive ? segments.indexOf(currentActive) : -1;

  if (currentIndex > 0) {
    const prevSegment = segments[currentIndex - 1];
    prevSegment.click(); // Clicking the segment usually seeks the video
    scrollSegmentIntoView(prevSegment);
    console.log("Clicked previous transcript segment.");
  } else if (segments.length > 0 && currentIndex === -1) {
    // If no active segment, clicking 'previous' could go to the first.
    segments[0].click();
    scrollSegmentIntoView(segments[0]);
    console.log("No active segment, clicked first transcript segment as previous.");
  } else {
    console.log("Already at the first transcript segment or no active segment found.");
  }
}

// Function to replay the current transcript segment
function replayCurrentTranscript() {
  const segments = getTranscriptSegments();
  if (segments.length === 0) {
    console.log("No transcript segments found to replay.");
    return;
  }

  let currentActive = findCurrentActiveSegment(segments);
  if (currentActive) {
    currentActive.click(); // Clicking the segment usually seeks the video to its start
    scrollSegmentIntoView(currentActive);
    console.log("Clicked (replayed) current transcript segment.");
  } else {
    console.log("No active transcript segment found to replay.");
  }
}

// Function to go to the next transcript segment
function goToNextTranscript() {
  const segments = getTranscriptSegments();
  if (segments.length === 0) {
    console.log("No transcript segments found to go to next.");
    return;
  }

  let currentActive = findCurrentActiveSegment(segments);
  let currentIndex = currentActive ? segments.indexOf(currentActive) : -1;

  if (currentIndex !== -1 && currentIndex < segments.length - 1) {
    const nextSegment = segments[currentIndex + 1];
    nextSegment.click(); // Clicking the segment usually seeks the video
    scrollSegmentIntoView(nextSegment);
    console.log("Clicked next transcript segment.");
  } else if (segments.length > 0 && currentIndex === -1) {
    // If no active segment, clicking 'next' could go to the first as well.
    segments[0].click();
    scrollSegmentIntoView(segments[0]);
    console.log("No active segment, clicked first transcript segment as next.");
  } else {
    console.log("Already at the last transcript segment or no active segment found.");
  }
}

// Event listener for keyboard shortcuts
document.addEventListener('keydown', function(event) {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
    return;
  }

  // Check if the key is one of ours, and if so, prevent default YouTube shortcuts if necessary
  // (e.g. 'S' might be a YouTube shortcut if not handled)
  // However, for A, S, D, they are not common global YouTube shortcuts.
  // If they were (e.g. 'K' for play/pause), event.preventDefault() would be important.

  switch (event.key.toUpperCase()) {
    case 'A':
      // event.preventDefault(); // Uncomment if 'A' conflicts with YouTube
      goToPreviousTranscript();
      break;
    case 'S':
      // event.preventDefault(); // Uncomment if 'S' conflicts with YouTube
      replayCurrentTranscript();
      break;
    case 'D':
      // event.preventDefault(); // Uncomment if 'D' conflicts with YouTube
      goToNextTranscript();
      break;
  }
});

// Observer to detect when transcript is loaded or becomes visible
// YouTube dynamically loads content, so we might need to wait.
const observer = new MutationObserver((mutationsList, observer) => {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
            const transcriptPanel = document.querySelector(TRANSCRIPT_PANEL_SELECTOR);
            if (transcriptPanel && !transcriptPanel.hidden) {
                // console.log("Transcript panel detected or became visible.");
                // Potentially initialize or re-check segments here if needed
                // For now, functions get segments on demand.
            }
        }
    }
});

// Start observing the body for changes, to detect when transcript panel might appear
observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

console.log("YouTube Transcript Navigator event listeners and transcript logic set up.");
