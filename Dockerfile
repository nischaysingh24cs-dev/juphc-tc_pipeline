# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install required dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose port 8080 for the application to listen on
EXPOSE 8080

# Run Gunicorn with 4 worker processes, binding to port 8080
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8080", "service:app"]
