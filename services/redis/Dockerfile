FROM redis/redis-stack-server

# Add any necessary configurations or setup for your production environment
# For example, you could copy over your own Redis configuration file
# COPY redis.conf /usr/local/etc/redis/redis.conf

# Expose the Redis port
EXPOSE 6379
COPY redis.conf /usr/local/etc/redis/redis.conf
# Start the Redis Stack container
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
