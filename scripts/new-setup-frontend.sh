# new-setup-frontend.sh
#!/bin/bash

# Remove existing directory if it exists
if [ -d "stayrunners-frontend" ]; then
    rm -rf stayrunners-frontend
fi

# Create Next.js project
npx create-next-app@latest stayrunners-frontend --typescript --tailwind --app

cd stayrunners-frontend

# Install dependencies with exact versions to avoid warnings
npm install socket.io-client@4.7.5
npm install @react-google-maps/api@2.19.3
npm install axios@1.6.8
npm install lucide-react@0.358.0
npm install @auth0/nextjs-auth0@3.5.0
npm install mapbox-gl@3.2.0
npm install @mapbox/mapbox-gl-geocoder@5.0.2
npm install zustand@4.5.2
npm install @radix-ui/react-dialog@1.0.5
npm install @radix-ui/react-popover@1.0.7
npm install class-variance-authority@0.7.0
npm install clsx@2.1.0
npm install tailwind-merge@2.2.1

# Install dev dependencies
npm install -D @types/mapbox-gl@3.1.0
npm install -D @types/mapbox__mapbox-gl-geocoder@4.5.7
npm install -D jest@29.7.0
npm install -D @testing-library/react@14.2.1
npm install -D @testing-library/jest-dom@6.4.2
npm install -D @testing-library/user-event@14.5.2
npm install -D jest-environment-jsdom@29.7.0

# Create directory structure
mkdir -p src/app/{auth/{login,register},customer/{dashboard,orders},runner/{dashboard,inventory}}
mkdir -p src/components/{auth,chat,maps,negotiation,layout,shared,ui}
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/store
mkdir -p src/styles
mkdir -p src/types
mkdir -p src/utils
