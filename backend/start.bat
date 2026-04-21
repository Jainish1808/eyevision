@echo off
REM Eyewear E-commerce API - Windows Startup Script

echo ================================
echo Eyewear E-commerce API
echo ================================

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.exe

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Copy .env.example to .env if not exists
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Please update .env with your configuration
)

REM Run database seeding (optional)
if "%1"=="--seed" (
    echo Seeding database...
    python seed_data.py
)

REM Start the server
echo Starting server on http://localhost:3000
echo API Docs: http://localhost:3000/docs
uvicorn main:app --host 0.0.0.0 --port 3000 --reload
