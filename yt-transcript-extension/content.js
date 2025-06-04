(function() {
  // Attempt to get transcript segments from the page
  function getSegments() {
    return Array.from(document.querySelectorAll('ytd-transcript-segment-renderer'));
  }

  function findCurrentIndex(segments) {
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.getAttribute('aria-selected') === 'true') {
        return i;
      }
    }
    return -1;
  }

  function getStartTimeMs(seg) {
    if (!seg) return null;
    const attrs = ['start-offset-ms', 'data-start-ms', 'start-ms'];
    for (const a of attrs) {
      const val = seg.getAttribute(a);
      if (val) return parseInt(val, 10);
    }
    // Fallback: try to read timestamp text like 0:12
    const timeEl = seg.querySelector('#start-time') || seg.querySelector('.cue-group-start-offset');
    if (timeEl) {
      const parts = timeEl.textContent.trim().split(':');
      if (parts.length === 2) {
        return (parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)) * 1000;
      }
    }
    return null;
  }

  function seekToSegment(seg) {
    const ms = getStartTimeMs(seg);
    if (ms != null) {
      const video = document.querySelector('video');
      if (video) {
        video.currentTime = ms / 1000;
      }
    }
  }

  document.addEventListener('keydown', function(e) {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const key = e.key.toLowerCase();
    if (!['a', 's', 'd'].includes(key)) return;

    const segments = getSegments();
    if (segments.length === 0) return; // transcript not open

    let idx = findCurrentIndex(segments);
    if (idx === -1) idx = 0;

    if (key === 'a') {
      idx = Math.max(0, idx - 1);
    } else if (key === 'd') {
      idx = Math.min(segments.length - 1, idx + 1);
    }
    // 's' replays current transcript, so idx stays the same

    const targetSeg = segments[idx];
    if (targetSeg) {
      seekToSegment(targetSeg);
    }
  });
})();
