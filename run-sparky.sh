#!/bin/bash

NODE_SCRIPT="sparky-reader.js"
LOGFILE="sparky-output.log"
PIDFILE=".sparky.pid"
JSONFILE="sparky.json"

DEFAULT_IP="127.0.0.1"
DEFAULT_PORT="3602"
read -p "Enter Sparky IP address [${DEFAULT_IP}]: " INPUT_IP
read -p "Enter Sparky Port number [${DEFAULT_PORT}]: " INPUT_PORT
SPARKY_IP="${INPUT_IP:-$DEFAULT_IP}"
SPARKY_PORT="${INPUT_PORT:-$DEFAULT_PORT}"

function run_terminal_output() {
  echo "Starting DSMR reader (output to terminal)..."
  node "$NODE_SCRIPT" --terminal --ip "$SPARKY_IP" --port "$SPARKY_PORT"
}

function run_file_output() {
  echo "Starting DSMR reader (saving to $JSONFILE)..."
  node "$NODE_SCRIPT" --file --ip "$SPARKY_IP" --port "$SPARKY_PORT"
}

function run_web_service() {
  echo "Starting DSMR reader with REST API..."
  nohup node "$NODE_SCRIPT" --api --ip "$SPARKY_IP" --port "$SPARKY_PORT" > "$LOGFILE" 2>&1 &
  echo $! > "$PIDFILE"
  echo "Web service started at http://localhost:3000/api"
  echo "Logs written to $LOGFILE"
}

function show_menu() {
  echo "=============================="
  echo " Chargee Sparky local API tester"
  echo "=============================="
  echo "1) Output to terminal"
  echo "2) Save to sparky.json"
  echo "3) Start REST API service"
  echo "4) Quit application"
  echo "------------------------------"
}

while true; do
  show_menu
  read -p "Choose an option [1-5]: " choice
  case $choice in
    1) run_terminal_output ;;
    2) run_file_output ;;
    3) run_web_service ;;
    4) echo "Bye 👋"; exit 0 ;;
    *) echo "Invalid option" ;;
  esac
done
