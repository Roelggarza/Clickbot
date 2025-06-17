let recording = false;
let clicks = [];
let timer = 0;
let clickArea = document.getElementById('click-area');
let recordButton = document.getElementById('record');
let playButton = document.getElementById('play');

// Record clicks
clickArea.addEventListener('click', (e) => {
  if (recording) {
    clicks.push({
      x: e.clientX,
      y: e.clientY,
      time: Date.now() - timer
    });
  }
});

// Start recording
recordButton.addEventListener('click', () => {
  recording = true;
  clicks = [];
  timer = Date.now();
  recordButton.disabled = true;
  playButton.disabled = true;

  setTimeout(() => {
    recording = false;
    recordButton.disabled = false;
    playButton.disabled = false;
  }, parseInt(document.getElementById('timer').value) * 1000);
});

// Play recorded clicks
playButton.addEventListener('click', () => {
  let currentTime = 0;
  clicks.forEach((click) => {
    setTimeout(() => {
      let event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1,
        clientX: click.x,
        clientY: click.y,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        buttons: 1,
        relatedTarget: null
      });
      clickArea.dispatchEvent(event);
    }, currentTime + click.time);
    currentTime += click.time;
  });
});
