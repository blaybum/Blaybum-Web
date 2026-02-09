#!/bin/bash

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker does not seem to be running, run it first and retry"
  exit 1
fi

echo "Building and starting Blaybum Web via Docker Compose..."
docker-compose up --build -d

echo ""
echo "Application started! You can access it at http://localhost:3000"
echo "To stop the application, run: docker-compose down"
