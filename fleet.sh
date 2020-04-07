#!/bin/bash

function usage () {
  echo "Usage: "
  echo "  fleet.sh local|dev|prod|ui [-n <project_name>] [-p <port>]"
  echo "  fleet.sh -h (print this message)"
  echo "    <command> - one of 'local', 'dev' or 'prod'"
  echo "      - 'local' - build and start provided fleet api (-n and -p options must be set)"
  echo "      - 'dev' - build and start fleet apis with docker compose up and dotnet watch"
  echo "      - 'prod' - build and start fleet apis with docker compose up -d in production mode"
  echo "      - 'ui' - build and start fleet ui locally"
  echo "    -n - project name to build and run"
  echo "    -p - api port to bind"
}

echo "FO Building Script"
cd "$(dirname "$0")"

mkdir -p ./data/FleetManagement
mkdir -p ./data/TransportationManagement
mkdir -p ./data/FuelStations
mkdir -p ./nginx/log

SOLUTION_NAME='FO'
SOLUTION="./$SOLUTION_NAME.sln"
PROJECT_PREFIX="./src/$SOLUTION_NAME."
PROJECT_NAME=""
PORT=""

COMMAND=$1;shift

while getopts "h?wn:p:" opt; do
  case "$opt" in
    h|\?)
      usage
      exit 0
    ;;
    n)  PROJECT_NAME=$OPTARG
    ;;
    p)  PORT=$OPTARG
    ;;
  esac
done

case "$COMMAND" in
  local)
    if [ "$PORT" = "" -o "$PROJECT_NAME" = "" ]; then
      usage
      exit 1
    fi
    ASPNETCORE_ENVIRONMENT="Development"
    dotnet run -p "${PROJECT_PREFIX}${PROJECT_NAME}" -- --urls="http://localhost:"$PORT
    ;;
  dev)
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
    ;;
  prod)
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build 
    ;;
  build)
    # tbd
    ;;
  ui)
    npm install --prefix ./src/Fleet.UI/node_modules ./src/Fleet.UI
    REACT_APP_HERE_APP_ID=fLR4pqJX0jZZZle8nwaM REACT_APP_HERE_APP_CODE=eM1d0zQLOLaA44cULr6NwQ npm start --prefix ./src/Fleet.UI
    ;;
  *)
    usage
    exit 1
    ;;
esac
exit $?
