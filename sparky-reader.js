const args = process.argv.slice(2);
const OUTPUT_TO_FILE = args.includes('--file');
const OUTPUT_TO_TERMINAL = args.includes('--terminal');
const OUTPUT_TO_API = args.includes('--api');
const fs = require('fs');
const OUTPUT_FILE = 'sparky.json';
const net = require('net');
const express = require('express');
const app = express();
const PORT_API = 3000; // REST API port

const ipIndex = args.indexOf('--ip');
const portIndex = args.indexOf('--port');
const HOST = ipIndex !== -1 && args[ipIndex + 1] ? args[ipIndex + 1] : '127.0.0.1';
const PORT_SOCKET = portIndex !== -1 && args[portIndex + 1] ? parseInt(args[portIndex + 1]) : 3602;

let latestData = {}; // Stores the most recent parsed DSMR message

// Connect to Sparky P1 meter via TCP
const client = new net.Socket();
client.connect(PORT_SOCKET, HOST, () => {
    console.log(`Connected to Sparky P1 meter at ${HOST}:${PORT_SOCKET}`);
});

let buffer = '';

client.on('data', (data) => {
    buffer += data.toString();

    if (buffer.includes('!')) {
        const message = buffer.trim();
        buffer = '';
        const parsed = parseDSMR(message);
       latestData = parsed; // Save latest parsed data
       if (OUTPUT_TO_TERMINAL) {
           console.log(JSON.stringify(parsed, null, 2));
       }
       if (OUTPUT_TO_FILE) {
           fs.writeFileSync(OUTPUT_FILE, JSON.stringify(parsed, null, 2));
       }
       if (OUTPUT_TO_API) {
           console.log('DSMR message updated (API mode)');
       }
    }
});

client.on('close', () => console.log('Socket connection closed'));
client.on('error', (err) => console.error('Socket error:', err.message));

if (OUTPUT_TO_API) {
    // REST API endpoint to get latest DSMR data
    app.get('/api', (req, res) => {
        res.json(latestData);
    });

    // Start REST API server
    app.listen(PORT_API, () => {
        console.log(`REST API listening at http://localhost:${PORT_API}/api`);
    });
}

// Parse DSMR telegram
function parseDSMR(telegram) {
    const lines = telegram.split('\n');
    const data = {};

    const fieldMap = {
        '1-3:0.2.8': 'dsmrVersion',
        '0-0:1.0.0': 'timestamp',
        '0-0:96.1.1': 'equipmentId',
        '1-0:1.8.1': 'totalConsumedTariff1',
        '1-0:1.8.2': 'totalConsumedTariff2',
        '1-0:2.8.1': 'totalProducedTariff1',
        '1-0:2.8.2': 'totalProducedTariff2',
        '0-0:96.14.0': 'tariffIndicator',
        '1-0:1.7.0': 'currentPowerConsumption',
        '1-0:2.7.0': 'currentPowerProduction',
        '0-0:96.7.21': 'powerFailureCount',
        '0-0:96.7.9': 'longPowerFailureCount',
        '0-0:96.13.0': 'textMessage',
        '1-0:21.7.0': 'phase1PowerL1',
        '1-0:41.7.0': 'phase1PowerL2',
        '1-0:61.7.0': 'phase1PowerL3',
        '1-0:22.7.0': 'phase2PowerL1',
        '1-0:42.7.0': 'phase2PowerL2',
        '1-0:62.7.0': 'phase2PowerL3',
        '1-0:32.7.0': 'voltageL1',
        '1-0:52.7.0': 'voltageL2',
        '1-0:72.7.0': 'voltageL3',
        '1-0:31.7.0': 'currentL1',
        '1-0:51.7.0': 'currentL2',
        '1-0:71.7.0': 'currentL3',
        '0-1:24.1.0': 'gasDeviceType',
        '0-1:96.1.0': 'gasEquipmentId',
        '0-1:24.2.1': 'gasMeasurement',
        '0-2:24.1.0': 'waterDeviceType',
        '0-2:96.1.0': 'waterEquipmentId',
        '0-2:24.2.1': 'waterMeasurement'
    };

    for (const line of lines) {
        const match = line.match(/^([0-9A-z\-:.]+)\(([^)]+)\)(?:\(([^)]+)\))?/);
        if (match) {
            const key = match[1];
            const value1 = match[2];
            const value2 = match[3];

            const label = fieldMap[key] || key.replace(/[^a-zA-Z0-9]/g, '_');

            if (value2 !== undefined) {
                data[label] = {
                    timestamp: value1,
                    value: value2
                };
            } else {
                data[label] = isNaN(value1) ? value1 : parseFloat(value1);
            }
        }
    }

    return data;
}
