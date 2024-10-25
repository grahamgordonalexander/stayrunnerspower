#!/bin/bash

# Create Next.js project
npx create-next-app@latest stayrunners-frontend --typescript --tailwind --app

cd stayrunners-frontend

# Install dependencies
npm install socket.io-client @react-google-maps/api axios lucide-react @auth0/nextjs-auth0 
npm install mapbox-gl @mapbox/mapbox-gl-geocoder zustand @radix-ui/react-dialog @radix-ui/react-popover
npm install class-variance-authority clsx tailwind-merge
npm install -D @types/mapbox-gl @types/mapbox__mapbox-gl-geocoder
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# Create directory structure
mkdir -p src/app/{auth/{login,register},customer/{dashboard,orders},runner/{dashboard,inventory}}
mkdir -p src/components/{auth,chat,maps,negotiation,layout,shared,ui}
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/store
mkdir -p src/styles
mkdir -p src/types
mkdir -p src/utils

# Create files
touch src/app/layout.tsx
touch src/app/page.tsx

# Auth pages
touch src/app/auth/login/page.tsx
touch src/app/auth/register/page.tsx

# Customer pages
touch src/app/customer/dashboard/page.tsx
touch src/app/customer/orders/page.tsx

# Runner pages
touch src/app/runner/dashboard/page.tsx
touch src/app/runner/inventory/page.tsx

# Components
touch src/components/auth/LoginForm.tsx
touch src/components/auth/RegisterForm.tsx

touch src/components/chat/ChatInterface.tsx
touch src/components/chat/MessageBubble.tsx
touch src/components/chat/ChatInput.tsx

touch src/components/maps/MapView.tsx
touch src/components/maps/EnhancedMap.tsx

touch src/components/negotiation/NegotiationDialog.tsx

touch src/components/shared/ErrorBoundary.tsx
touch src/components/shared/LoadingSpinner.tsx
touch src/components/shared/LoadingScreen.tsx

# Hooks
touch src/hooks/useGroqChat.ts
touch src/hooks/useAuth.ts
touch src/hooks/useMap.ts

# Lib files
touch src/lib/socket.ts
touch src/lib/auth.ts
touch src/lib/offline.ts
touch src/lib/notifications.ts

# Store
touch src/store/index.ts

# Types
touch src/types/chat.ts
touch src/types/order.ts
touch src/types/user.ts

# Utils
touch src/utils/validation.ts
touch src/utils/format.ts

# Test files
touch jest.config.js
touch jest.setup.js
touch src/components/chat/ChatInterface.test.tsx

# Environment files
touch .env.local
touch .env.development
touch .env.production

# Create necessary config files
cat > .env.local << EOL
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
EOL

cat > jest.config.js << EOL
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
EOL

cat > jest.setup.js << EOL
import '@testing-library/jest-dom'
EOL

# Update package.json scripts
npm pkg set scripts.test="jest"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.test:coverage="jest --coverage"

# Make the script executable
chmod +x setup-frontend.sh
