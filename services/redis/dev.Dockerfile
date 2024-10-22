FROM redis/redis-stack

# Add any necessary configurations or setup for your development environment
# For example, you could copy over your own Redis configuration file
# COPY redis.conf /usr/local/etc/redis/redis.conf

# Expose the Redis and RedisInsight ports
EXPOSE 6379
EXPOSE 8001

COPY redis.conf /usr/local/etc/redis/redis.conf
# Start the Redis Stack container
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
