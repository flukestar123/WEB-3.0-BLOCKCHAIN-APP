const express = require('express');
const app = express();

const CryptoJS = require("crypto-js");
var miningInterval; // Global variable to hold the mining interval ID

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

// Start mining route
app.get('/start-mining', (req, res) => {
    res.redirect('/');
    startMining();
});

// Stop mining route
app.get('/stop-mining', (req, res) => {
    res.redirect('/');
    stopMining();
});

function startMining() {
    console.log("mining started")
    miningInterval = setInterval(simulateMining, 2000);
}

function stopMining() {
    clearInterval(miningInterval);
    console.log("mining stopped");
}

function simulateMining() {
    let nonce = Math.floor(Math.random() * 1000000000);
    let target = 10; // Difficulty target (in this example, set to 1 trillion)
    const startTime = Date.now();
    const maxDuration = 1 * 60 * 1000; 
    //const targetCPUUsage = 0.7;
    let elapsed = 0
    let cpuUsage = 0
    while (true) {
        const now = Date.now();
        elapsed = now - startTime;
        //cpuUsage = performance.now() / 1000;
        console.log(maxDuration)

        if(elapsed > maxDuration){
            stopMining()
            console.log("TIMEOUT")
        }

        if(cpuUsage > 150){
            console.log("MINING STOPPED : CPU THROTTLE DETECTED")
            stopMining()
        }

        let hash = sha256(nonce); // Calculate the SHA-256 hash of the nonce
        console.log("HASH : " + hash);
        console.log("MINING NOW == Time Elapsed : " + Math.floor(elapsed) + "ms")
        console.log()
        // Check if the hash is less than the target
        if (parseInt(hash, 16) < target) {
            console.log(hash);
            console.log("Block mined with nonce: " + nonce);
            clearInterval(miningInterval); // Stop the mining process
            break;
        }

        nonce++; // Increment the nonce and try again
    }
}

// A simple SHA-256 hash function (for demonstration purposes only)
function sha256(input) {
    let hash = CryptoJS.SHA256(input.toString());
    return hash.toString(CryptoJS.enc.Hex);
}

app.listen(3500, () => {
    console.log('Server started on port 3500');
});

