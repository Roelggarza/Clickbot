const clickBotHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Click Bot</title>
  <style>
    #click-area {
      width: 300px;
      height: 200px;
      border: 1px solid black;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>Click Bot</h1>
  <input id="timer" type="number" value="10" />
  <div id="click-area"></div>
  <button id="record">Record</button>
  <button id="play">Play</button>

  <script>
    class ClickBot {
      constructor() {
        this.recording = false;
        this.clicks = [];
        this.timer = 0;
        this.recordButton = document.getElementById('record');
        this.playButton = document.getElementById('play');
        this.clickArea = document.getElementById('click-area');
        this.timerInput = document.getElementById('timer');

        this.recordButton.addEventListener('click', this.startRecording.bind(this));
        this.clickArea.addEventListener('click', this.handleClick.bind(this));
        this.playButton.addEventListener('click', this.playClicks.bind(this));
      }

      startRecording() {
        this.recording = true;
        this.clicks = [];
        this.timer = performance.now();
        this.recordButton.disabled = true;
        this.playButton.disabled = true;

        setTimeout(() => {
          this.recording = false;
          this.recordButton.disabled = false;
          this.playButton.disabled = false;
        }, parseInt(this.timerInput.value) * 1000
