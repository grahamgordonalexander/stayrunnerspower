# Use the official MongoDB Docker image
FROM mongo

# Copy the entrypoint script to the container
COPY ./Entrypoint.js /docker-entrypoint-initdb.d/

# Expose the default MongoDB port
EXPOSE 27017
