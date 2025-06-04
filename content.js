// content.js

// Updated selectors for YouTube's current transcript structure
const TRANSCRIPT_SEGMENT_SELECTOR = "ytd-transcript-segment-renderer";
const TRANSCRIPT_PANEL_SELECTOR = "ytd-transcript-renderer";
const TRANSCRIPT_CONTAINER_SELECTOR = "#segments-container";

// Alternative selectors to try if main ones don't work
const ALT_TRANSCRIPT_SEGMENT_SELECTOR = '[role="button"][data-start]';
const ALT_TRANSCRIPT_CONTAINER_SELECTOR = '[role="region"]';

// Selectors for transcript button
const TRANSCRIPT_BUTTON_SELECTORS = [
  'button[aria-label*="transcript" i]',
  'button[aria-label*="字幕" i]',
  'yt-button-renderer[aria-label*="transcript" i]',
  'yt-button-renderer[aria-label*="字幕" i]',
  '[role="button"][aria-label*="transcript" i]',
  '[role="button"][aria-label*="字幕" i]',
  'button[aria-label*="文字起こし" i]',
  'yt-button-renderer[aria-label*="文字起こし" i]',
];

// More actions menu selectors
const MORE_ACTIONS_BUTTON_SELECTORS = [
  'button[aria-label*="more" i]',
  'button[aria-label*="その他" i]',
  'yt-button-renderer[aria-label*="more" i]',
  'yt-button-renderer[aria-label*="その他" i]',
  "#menu-button",
  ".dropdown-trigger",
];

// Description "more" button selectors
const DESCRIPTION_MORE_BUTTON_SELECTORS = [
  "#description-inline-expander button",
  "#description .more-button",
  "ytd-text-inline-expander-renderer button",
  "yt-formatted-string #expand",
  '[aria-label*="more" i]:not([aria-label*="actions" i])',
  ".description-more-button",
  "#more",
];

// Function to get all transcript segments with multiple fallback methods
function getTranscriptSegments() {
  // Method 1: Standard selectors
  const transcriptPanel = document.querySelector(TRANSCRIPT_PANEL_SELECTOR);
  if (transcriptPanel) {
    const transcriptContainer = transcriptPanel.querySelector(
      TRANSCRIPT_CONTAINER_SELECTOR
    );
    if (transcriptContainer) {
      const segments = Array.from(
        transcriptContainer.querySelectorAll(TRANSCRIPT_SEGMENT_SELECTOR)
      );
      if (segments.length > 0) {
        return segments;
      }
    }

    // Try alternative within the panel
    const altSegments = Array.from(
      transcriptPanel.querySelectorAll(TRANSCRIPT_SEGMENT_SELECTOR)
    );
    if (altSegments.length > 0) {
      return altSegments;
    }
  }

  // Method 2: Try alternative selectors
  const altSegments = Array.from(
    document.querySelectorAll(ALT_TRANSCRIPT_SEGMENT_SELECTOR)
  );
  if (altSegments.length > 0) {
    return altSegments;
  }

  // Method 3: Try even more generic approach
  const allSegments = Array.from(
    document.querySelectorAll(TRANSCRIPT_SEGMENT_SELECTOR)
  );
  if (allSegments.length > 0) {
    return allSegments;
  }

  return [];
}

// Function to check if transcript panel is open
function isTranscriptPanelOpen() {
  const transcriptPanel = document.querySelector(TRANSCRIPT_PANEL_SELECTOR);
  if (!transcriptPanel) return false;

  const container = transcriptPanel.querySelector(
    TRANSCRIPT_CONTAINER_SELECTOR
  );
  if (!container) return false;

  // Check if it's visible and has content
  const style = window.getComputedStyle(transcriptPanel);
  const containerStyle = window.getComputedStyle(container);

  return (
    style.display !== "none" &&
    containerStyle.display !== "none" &&
    !transcriptPanel.hidden &&
    !container.hidden
  );
}

// Function to expand description if needed
function expandDescription() {
  return new Promise((resolve) => {
    // Look for description "more" button
    for (const selector of DESCRIPTION_MORE_BUTTON_SELECTORS) {
      const moreButton = document.querySelector(selector);
      if (moreButton && moreButton.offsetParent !== null) {
        // Check if it's actually a "more" button by looking at text content
        const buttonText = moreButton.textContent?.toLowerCase();
        if (
          buttonText &&
          (buttonText.includes("more") ||
            buttonText.includes("さらに") ||
            buttonText.includes("もっと"))
        ) {
          moreButton.click();
          // Wait for description to expand
          setTimeout(resolve, 1000);
          return;
        }
      }
    }

    // Also try looking for text-based "more" links
    const textElements = document.querySelectorAll("span, a, button");
    for (const element of textElements) {
      const text = element.textContent?.toLowerCase().trim();
      if (
        text === "more" ||
        text === "...more" ||
        text === "さらに表示" ||
        text === "もっと見る"
      ) {
        if (element.offsetParent !== null) {
          // Check if visible
          element.click();
          setTimeout(resolve, 1000);
          return;
        }
      }
    }

    // No more button found, resolve immediately
    resolve();
  });
}

// Function to find and click transcript button
function findAndClickTranscriptButton() {
  // First, try to find direct transcript buttons
  for (const selector of TRANSCRIPT_BUTTON_SELECTORS) {
    const button = document.querySelector(selector);
    if (button && button.offsetParent !== null) {
      // Check if visible
      button.click();
      return true;
    }
  }

  // If no direct button found, try to open "More actions" menu first
  for (const selector of MORE_ACTIONS_BUTTON_SELECTORS) {
    const moreButton = document.querySelector(selector);
    if (moreButton && moreButton.offsetParent !== null) {
      moreButton.click();

      // Wait a bit for menu to open, then look for transcript button
      setTimeout(() => {
        for (const transcriptSelector of TRANSCRIPT_BUTTON_SELECTORS) {
          const transcriptButton = document.querySelector(transcriptSelector);
          if (transcriptButton && transcriptButton.offsetParent !== null) {
            transcriptButton.click();
            return true;
          }
        }

        // Also try looking for text-based buttons in the menu
        const menuItems = document.querySelectorAll(
          'yt-formatted-string, .menu-item, [role="menuitem"]'
        );
        for (const item of menuItems) {
          const text = item.textContent?.toLowerCase();
          if (
            text &&
            (text.includes("transcript") ||
              text.includes("字幕") ||
              text.includes("文字起こし"))
          ) {
            item.click();
            return true;
          }
        }
      }, 100);

      return true; // Return true since we tried
    }
  }

  return false;
}

// Function to automatically open transcript panel
async function autoOpenTranscript(maxAttempts = 10, currentAttempt = 0) {
  if (currentAttempt >= maxAttempts) {
    return;
  }

  // Check if transcript is already open
  if (isTranscriptPanelOpen()) {
    return;
  }

  // First, expand description if this is the first attempt
  if (currentAttempt === 0) {
    await expandDescription();
  }

  // Try to find and click transcript button
  if (findAndClickTranscriptButton()) {
    // Wait a bit and check if it opened
    setTimeout(() => {
      if (!isTranscriptPanelOpen()) {
        // Try again if it didn't open
        autoOpenTranscript(maxAttempts, currentAttempt + 1);
      }
    }, 1000);
  } else {
    // Button not found, try again after a delay
    setTimeout(() => {
      autoOpenTranscript(maxAttempts, currentAttempt + 1);
    }, 2000);
  }
}

// Function to get the start time of a segment
function getSegmentStartTime(segment) {
  // Try multiple ways to get the start time
  const dataStart = segment.getAttribute("data-start");
  if (dataStart) {
    return parseFloat(dataStart);
  }

  const timestampElement = segment.querySelector("[data-start]");
  if (timestampElement) {
    return parseFloat(timestampElement.getAttribute("data-start"));
  }

  // Try to parse from text content
  const timeText = segment.querySelector(
    ".segment-timestamp, .ytd-transcript-segment-renderer"
  )?.textContent;
  if (timeText) {
    const match = timeText.match(/(\d+):(\d+)/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
  }

  return null;
}

// Function to find the currently active transcript segment
function findCurrentActiveSegment(segments) {
  if (!segments || segments.length === 0) {
    return null;
  }

  // Method 1: Look for active attributes/classes
  for (const segment of segments) {
    const transcriptText = segment.querySelector("yt-formatted-string");
    if (transcriptText && transcriptText.hasAttribute("is-active-cue")) {
      return segment;
    }

    if (
      segment.classList.contains("active") ||
      segment.classList.contains("current") ||
      segment.hasAttribute("active") ||
      segment.hasAttribute("aria-current") ||
      segment.hasAttribute("aria-selected")
    ) {
      return segment;
    }

    // Check child elements for active state
    const activeChild = segment.querySelector(
      '[aria-current="true"], [aria-selected="true"], .active'
    );
    if (activeChild) {
      return segment;
    }
  }

  // Method 2: Match by video current time
  try {
    const videoPlayer = document.querySelector("video.html5-main-video, video");
    if (!videoPlayer) {
      return segments[0];
    }

    const currentTime = videoPlayer.currentTime;

    let closestSegment = segments[0];
    let closestDiff = Infinity;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const startTime = getSegmentStartTime(segment);

      if (startTime === null) continue;

      // Find the segment whose start time is closest to but not greater than current time
      if (startTime <= currentTime) {
        const diff = currentTime - startTime;
        if (diff < closestDiff) {
          closestDiff = diff;
          closestSegment = segment;
        }
      }
    }

    return closestSegment;
  } catch (e) {
    // Fallback to first segment on error
  }

  return segments[0];
}

// Function to scroll the transcript panel to make the segment visible
function scrollSegmentIntoView(segment) {
  if (segment && typeof segment.scrollIntoView === "function") {
    segment.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// Enhanced function to click a transcript segment
function clickTranscriptSegment(segment) {
  if (!segment) {
    return false;
  }

  try {
    // Method 1: Try clicking elements with data-start attribute
    const dataStartElement = segment.querySelector("[data-start]");
    if (dataStartElement) {
      dataStartElement.click();
      scrollSegmentIntoView(segment);
      return true;
    }

    // Method 2: Try clicking the segment itself if it has data-start
    if (segment.hasAttribute("data-start")) {
      segment.click();
      scrollSegmentIntoView(segment);
      return true;
    }

    // Method 3: Look for clickable children
    const clickableChild = segment.querySelector(
      'button, [role="button"], .ytd-transcript-segment-renderer'
    );
    if (clickableChild) {
      clickableChild.click();
      scrollSegmentIntoView(segment);
      return true;
    }

    // Method 4: Try clicking the segment directly
    segment.click();
    scrollSegmentIntoView(segment);

    // Method 5: Dispatch a proper click event
    const clickEvent = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    segment.dispatchEvent(clickEvent);

    return true;
  } catch (e) {
    // Silently fail
  }

  return false;
}

// Function to go to the previous transcript segment
function goToPreviousTranscript() {
  const segments = getTranscriptSegments();
  if (segments.length === 0) {
    return;
  }

  const currentActive = findCurrentActiveSegment(segments);
  const currentIndex = currentActive ? segments.indexOf(currentActive) : -1;

  if (currentIndex > 0) {
    const prevSegment = segments[currentIndex - 1];
    clickTranscriptSegment(prevSegment);
  } else {
    // Go to first segment
    const firstSegment = segments[0];
    clickTranscriptSegment(firstSegment);
  }
}

// Function to replay the current transcript segment
function replayCurrentTranscript() {
  const segments = getTranscriptSegments();
  if (segments.length === 0) {
    return;
  }

  const currentActive = findCurrentActiveSegment(segments);
  if (currentActive) {
    clickTranscriptSegment(currentActive);
  } else {
    const firstSegment = segments[0];
    clickTranscriptSegment(firstSegment);
  }
}

// Function to go to the next transcript segment
function goToNextTranscript() {
  const segments = getTranscriptSegments();
  if (segments.length === 0) {
    return;
  }

  const currentActive = findCurrentActiveSegment(segments);
  const currentIndex = currentActive ? segments.indexOf(currentActive) : -1;

  if (currentIndex !== -1 && currentIndex < segments.length - 1) {
    const nextSegment = segments[currentIndex + 1];
    clickTranscriptSegment(nextSegment);
  } else if (currentIndex === -1 && segments.length > 0) {
    // No current segment, go to first
    const firstSegment = segments[0];
    clickTranscriptSegment(firstSegment);
  }
}

// Enhanced event listener for keyboard shortcuts
document.addEventListener("keydown", function (event) {
  // Ignore if user is typing in input fields
  if (
    event.target.tagName === "INPUT" ||
    event.target.tagName === "TEXTAREA" ||
    event.target.isContentEditable ||
    event.target.closest('[contenteditable="true"]')
  ) {
    return;
  }

  // Ignore if modifier keys are pressed
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  const key = event.key.toUpperCase();

  switch (key) {
    case "A":
      event.preventDefault();
      goToPreviousTranscript();
      break;
    case "S":
      event.preventDefault();
      replayCurrentTranscript();
      break;
    case "D":
      event.preventDefault();
      goToNextTranscript();
      break;
  }
});

// Function to check if we're on a YouTube video page
function isYouTubeVideoPage() {
  return (
    window.location.hostname === "www.youtube.com" &&
    window.location.pathname === "/watch" &&
    window.location.search.includes("v=")
  );
}

// Function to test transcript functionality
function testTranscriptFunctionality() {
  const segments = getTranscriptSegments();

  if (segments.length === 0) {
    return false;
  }

  // Test getting start times
  for (let i = 0; i < Math.min(segments.length, 5); i++) {
    const segment = segments[i];
    getSegmentStartTime(segment);
  }

  // Test finding active segment
  const activeSegment = findCurrentActiveSegment(segments);
  const activeIndex = activeSegment ? segments.indexOf(activeSegment) : -1;

  return true;
}

// Function to wait for transcript panel to be available
function waitForTranscriptPanel(
  callback,
  maxAttempts = 15,
  currentAttempt = 0
) {
  if (currentAttempt >= maxAttempts) {
    return;
  }

  const transcriptPanel = document.querySelector(TRANSCRIPT_PANEL_SELECTOR);
  if (transcriptPanel) {
    callback();
  } else {
    setTimeout(() => {
      waitForTranscriptPanel(callback, maxAttempts, currentAttempt + 1);
    }, 1000);
  }
}

// Function to wait for video to be ready
function waitForVideoReady(callback, maxAttempts = 20, currentAttempt = 0) {
  if (currentAttempt >= maxAttempts) {
    return;
  }

  const video = document.querySelector("video.html5-main-video, video");
  const playerContainer = document.querySelector(
    "#movie_player, .html5-video-player"
  );

  if (video && playerContainer && video.readyState >= 2) {
    // Video is ready
    setTimeout(callback, 1000); // Wait a bit more for UI to be ready
  } else {
    setTimeout(() => {
      waitForVideoReady(callback, maxAttempts, currentAttempt + 1);
    }, 500);
  }
}

// Initialize when page loads
function initialize() {
  if (!isYouTubeVideoPage()) {
    return;
  }

  // Wait for video to be ready, then try to auto-open transcript
  waitForVideoReady(() => {
    // Try to auto-open transcript after a short delay
    setTimeout(() => {
      autoOpenTranscript();
    }, 2000);

    // Also wait for transcript panel and test functionality
    waitForTranscriptPanel(() => {
      setTimeout(() => {
        testTranscriptFunctionality();
      }, 1000);
    });
  });
}

// Observer to detect when transcript is loaded or page changes
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      // Check if we navigated to a new video
      if (isYouTubeVideoPage()) {
        const transcriptPanel = document.querySelector(
          TRANSCRIPT_PANEL_SELECTOR
        );
        if (transcriptPanel) {
          // Test after a short delay
          setTimeout(() => {
            testTranscriptFunctionality();
          }, 500);
        }
      }
    }
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initialize immediately and also when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

// Also initialize on page navigation (YouTube is SPA)
let currentUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    setTimeout(initialize, 1000);
  }
}, 1000);
