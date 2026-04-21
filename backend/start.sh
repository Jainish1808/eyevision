#!/bin/bash

# Eyewear E-commerce API - Startup Script
# This script sets up and runs the FastAPI backend

set -e

echo "================================"
echo "Eyewear E-commerce API"
echo "================================"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Copy .env.example to .env if not exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please update .env with your configuration"
fi

# Run database seeding (optional)
if [ "$1" == "--seed" ]; then
    echo "Seeding database..."
    python seed_data.py
fi

# Start the server
echo "Starting server on http://localhost:3000"
echo "API Docs: http://localhost:3000/docs"
uvicorn main:app --host 0.0.0.0 --port 3000 --reload
