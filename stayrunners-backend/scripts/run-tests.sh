#!/bin/bash

set -e

echo "Starting test suite execution..."

# Function to check if MongoDB is running
check_mongo() {
    echo "Checking MongoDB Memory Server setup..."
    if [ ! -f /usr/lib64/libcrypto.so.1.1 ]; then
        echo "Error: libcrypto.so.1.1 not found. Please run install-test-dependencies.sh first"
        exit 1
    fi
}

# Function to clean test cache
clean_cache() {
    echo "Cleaning test cache..."
    jest --clearCache
    rm -rf coverage
    rm -rf .jest
}

# Function to run tests
run_tests() {
    echo "Running test suite..."
    
    # Clean test cache
    clean_cache

    # Run tests with different configurations
    echo "Running unit tests..."
    npm test -- --testPathPattern=unit --verbose
    
    echo "Running integration tests..."
    npm test -- --testPathPattern=integration --verbose
    
    echo "Running E2E tests..."
    npm test -- --testPathPattern=e2e --verbose
}

# Function to display test results
show_results() {
    echo "Test Results Summary:"
    if [ -d "coverage" ]; then
        echo "Coverage report available in coverage directory"
    fi
}

# Main execution
main() {
    check_mongo
    run_tests
    show_results
}

main
