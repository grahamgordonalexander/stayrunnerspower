#!/bin/bash

set -e

echo "Starting test dependencies installation..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to detect OS
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
    elif command_exists lsb_release; then
        OS=$(lsb_release -si)
    elif [ -f /etc/lsb-release ]; then
        . /etc/lsb-release
        OS=$DISTRIB_ID
    else
        OS=$(uname -s)
    fi
    echo $OS
}

# Install dependencies based on OS
install_dependencies() {
    local os=$(detect_os)
    echo "Detected OS: $os"

    case $os in
        *"CentOS"* | *"Red Hat"* | *"Fedora"*)
            echo "Installing dependencies for CentOS/RHEL..."
            sudo yum install -y openssl-devel
            # Create symbolic link for libcrypto
            if [ -f /usr/lib64/libcrypto.so.1.1 ]; then
                sudo rm /usr/lib64/libcrypto.so.1.1
            fi
            sudo ln -s /usr/lib64/libcrypto.so.3 /usr/lib64/libcrypto.so.1.1
            ;;
        *"Ubuntu"* | *"Debian"*)
            echo "Installing dependencies for Ubuntu/Debian..."
            sudo apt-get update
            sudo apt-get install -y libssl1.1
            ;;
        *)
            echo "Unsupported OS: $os"
            exit 1
            ;;
    esac
}

# Install Node.js dependencies
install_node_dependencies() {
    echo "Installing Node.js dependencies..."
    npm install --save-dev \
        @nestjs/testing \
        @types/jest \
        jest \
        ts-jest \
        @types/node \
        puppeteer \
        @types/puppeteer \
        mongodb-memory-server \
        @nestjs/common \
        @nestjs/core \
        @nestjs/platform-socket.io \
        @nestjs/websockets \
        socket.io-client \
        @types/socket.io-client
}

# Setup test environment
setup_test_env() {
    echo "Setting up test environment..."
    
    # Create test directory if it doesn't exist
    mkdir -p /tmp/mongodb-binaries
    chmod 777 /tmp/mongodb-binaries

    # Create necessary test files
    mkdir -p test
    if [ ! -f "test/jest.setup.ts" ]; then
        echo "Creating jest.setup.ts..."
        cat > test/jest.setup.ts << EOTS
jest.setTimeout(30000);

jest.mock('socket.io-client', () => {
    const mockSocket = {
        emit: jest.fn(),
        on: jest.fn(),
        disconnect: jest.fn()
    };
    return {
        io: jest.fn(() => mockSocket)
    };
});
EOTS
    fi

    # Create jest.config.js
    cat > jest.config.js << EOTC
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  verbose: true,
  testTimeout: 30000
};
EOTC
}

# Main execution
main() {
    echo "Starting installation process..."
    install_dependencies
    install_node_dependencies
    setup_test_env
    echo "Installation completed successfully!"
}

main
