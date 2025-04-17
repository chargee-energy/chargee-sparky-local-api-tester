# ⚡ Chargee Sparky DSMR Reader

A Node.js-based Chargee Sparky smart meter reader that can:

- Connect to a DSMR-compliant meter over a TCP socket
- Parse DSMR v2.2, v4, and v5 messages
- Support setups with or without gas meters, and single or 3-phase power
- Output data to the terminal, a JSON file, or a REST API

---

## 🚀 Features

- ✅ DSMR version support: 2.2, 4, 5
- ✅ Flexible output options:
    - Terminal (live log)
    - File (`sparky.json`)
    - REST API (`GET /api`)
- ✅ IP address and port configurable per session

---

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install express
```

---

## 🧪 Usage

Run the interactive Bash control script:

```bash
./run-sparky.sh
```

You’ll be prompted to enter the IP address and port of the Sparky meter:

```
Enter Sparky IP address [127.0.0.1]:
Enter Sparky Port number [3602]:
```

Then select from the interactive menu:

```
==============================
 Sparky DSMR Reader Control
==============================
1) Output to terminal
2) Save to sparky.json
3) Start REST API service
4) Stop DSMR reader
5) Exit
------------------------------
```

### Menu Options

- **1) Output to terminal:**  
  Reads from the meter and prints parsed data in real-time.

- **2) Save to sparky.json:**  
  Parses a DSMR message and writes the result to `sparky.json`.

- **3) Start REST API service:**  
  Launches an API on `http://localhost:3000/api` that serves the latest DSMR data.

- **4) Stop DSMR reader:**  
  Stops the background service started in API mode.

- **5) Exit:**  
  Exits the menu prompt.

---

## 🛠 Running sparky-reader.js manually

You can also invoke the script directly:

```bash
node sparky-reader.js --ip 192.168.1.100 --port 3602 --terminal
node sparky-reader.js --ip 192.168.1.100 --port 3602 --file
node sparky-reader.js --ip 192.168.1.100 --port 3602 --api
```

You may combine flags as needed:

```bash
node sparky-reader.js --ip 192.168.1.100 --port 3602 --file --terminal --api
```

## 👤 Author

**Bart van den Berg**  
Chargee Energy  
📧 bart@chargee.energy

## 📄 License

MIT License
