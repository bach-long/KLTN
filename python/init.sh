#!/bin/sh

# Migrate database
alembic upgrade head
alembic revision --autogenerate -m "Migrate database init"
alembic upgrade head

# Run UVicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &

# Run Celery worker
celery -A jobs.handleWriteDocument worker --loglevel=info -P threads
