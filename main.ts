import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const clickBotHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Click Bottitle>
    <style>
        #click-area {
            width: 300px;
            height: 200px;
            border: 1px solid black;
            margin-bottom: 20px;
        }
    style>
head>
<body>
    <h1>Click Both1>
    <input id="timer" type="number" value="10" />
    <div id="click-area">div>
    <button id="record">Recordbutton>
    <button id="play">Playbutton>

    <script>
        let recording = false;
        let clicks = [];
        let timer = 0;

        document.getElementById('record').addEventListener('click', () => {
            recording = true;
            clicks = [];
            timer = Date.now();
            document.getElementById('record').disabled = true;
            document.getElementById('play').disabled = true;

            setTimeout(() => {
                recording = false;
                document.getElementById('record').disabled = false;
                document.getElementById('play').disabled = false;
            }, parseInt(document.getElementById('timer').value) * 1000);
        });

        document.getElementById('click-area').addEventListener('click', (e) => {
            if (recording) {
                clicks.push({
                    x: e.clientX,
                    y: e.clientY,
                    time: Date.now() - timer
                });
                timer = Date.now();
            }
        });

        document.getElementById('play').addEventListener('click', () => {
            let currentTime = 0;
            clicks.forEach((click) => {
                setTimeout(() => {
                    const event = new MouseEvent('click', {
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
                    document.getElementById('click-area').dispatchEvent(event);
                }, currentTime + click.time);
                currentTime += click.time;
            });
        });
    script>
body>
html>
`;

serve((req) => {
    return new Response(clickBotHtml, {
        headers: {
            "content-type": "text/html; charset=UTF-8",
        },
    });
}, { port: 8000 });

console.log("Server running on port 8000");
