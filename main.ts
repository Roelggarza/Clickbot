// server.ts (or server.js)
import * as http from 'http';

const clickBotHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Click Bot Editor</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    #click-area {
      width: 300px;
      height: 200px;
      border: 2px dashed #555;
      margin: 20px 0;
      position: relative;
    }
    #ai-prompt {
      display: none;
      border: 1px solid #ccc;
      padding: 10px;
      margin-top: 10px;
    }
    .click-dot {
      width: 6px;
      height: 6px;
      background: red;
      border-radius: 50%;
      position: absolute;
      pointer-events: none;
    }
    button.small-btn {
      margin-left: 10px;
      font-size: 0.8em;
    }
  </style>
</head>
<body>
  <h1>AI Click Bot Editor</h1>
  <label>Record Duration (sec): <input id="timer" type="number" value="5" /></label><br/>
  <div id="click-area"></div>
  <button id="record">Record</button>
  <button id="play">Play</button>

  <div id="ai-prompt">
    <h3>AI Prompt: Timeline of Clicks</h3>
    <ul id="click-list"></ul>
    <button id="save-edits">Save & Play</button>
  </div>

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

        this.promptBox = document.getElementById('ai-prompt');
        this.clickList = document.getElementById('click-list');
        this.saveEditsButton = document.getElementById('save-edits');

        this.recordButton.addEventListener('click', this.startRecording.bind(this));
        this.clickArea.addEventListener('click', this.handleClick.bind(this));
        this.playButton.addEventListener('click', this.showPrompt.bind(this));
        this.saveEditsButton.addEventListener('click', this.playClicks.bind(this));
      }

      startRecording() {
        this.recording = true;
        this.clicks = [];
        this.timer = performance.now();
        this.promptBox.style.display = 'none';
        this.recordButton.disabled = true;
        this.playButton.disabled = true;
        this.clickArea.innerHTML = '';

        setTimeout(() => {
          this.recording = false;
          this.recordButton.disabled = false;
          this.playButton.disabled = false;
          this.showPrompt();
        }, parseInt(this.timerInput.value) * 1000);
      }

      handleClick(e) {
        if (this.recording || this.replacingIndex !== undefined) {
          const rect = this.clickArea.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width).toFixed(2);
          const y = ((e.clientY - rect.top) / rect.height).toFixed(2);
          const time = performance.now() - this.timer;

          const newClick = { x: parseFloat(x), y: parseFloat(y), time };

          if (this.replacingIndex !== undefined) {
            this.clicks[this.replacingIndex] = newClick;
            alert(\`Click #\${this.replacingIndex + 1} updated.\`);
            this.replacingIndex = undefined;
            this.showPrompt();
          } else {
            this.clicks.push(newClick);
            this.timer = performance.now();
          }

          const dot = document.createElement('div');
          dot.className = 'click-dot';
          dot.style.left = \`\${(x * 100).toFixed(1)}%\`;
          dot.style.top = \`\${(y * 100).toFixed(1)}%\`;
          this.clickArea.appendChild(dot);
        }
      }

      showPrompt() {
        this.clickList.innerHTML = '';
        this.clicks.forEach((click, i) => {
          const li = document.createElement('li');
          li.innerHTML = \`
            Click #\${i + 1} — (\${(click.x * 100).toFixed(0)}%, \${(click.y * 100).toFixed(0)}%) at \${click.time.toFixed(0)}ms
            <button class="small-btn" data-index="\${i}" onclick="editClick(\${i})">Edit</button>
            <button class="small-btn" data-index="\${i}" onclick="deleteClick(\${i})">Delete</button>
          \`;
          this.clickList.appendChild(li);
        });
        this.promptBox.style.display = 'block';
      }

      playClicks() {
        this.clickArea.innerHTML = '';
        const rect = this.clickArea.getBoundingClientRect();
        this.clicks.forEach((click) => {
          setTimeout(() => {
            const event = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
              clientX: rect.left + rect.width * click.x,
              clientY: rect.top + rect.height * click.y
            });
            this.clickArea.dispatchEvent(event);

            const flash = document.createElement('div');
            flash.className = 'click-dot';
            flash.style.left = \`\${(click.x * 100).toFixed(1)}%\`;
            flash.style.top = \`\${(click.y * 100).toFixed(1)}%\`;
            flash.style.background = 'blue';
            this.clickArea.appendChild(flash);
            setTimeout(() => flash.remove(), 400);
          }, click.time);
        });
      }

      editClick(index) {
        alert(\`Click somewhere to replace Click #\${index + 1}.\`);
        this.replacingIndex = index;
      }

      deleteClick(index) {
        this.clicks.splice(index, 1);
        this.showPrompt();
      }
    }

    const bot = new ClickBot();
    // Allow inline buttons to call class methods
    window.editClick = (i) => bot.editClick(i);
    window.deleteClick = (i) => bot.deleteClick(i);
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(clickBotHtml);
});

server.listen(8000, () => {
  console.log('Server running at http://localhost:8000');
});
