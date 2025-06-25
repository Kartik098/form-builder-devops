FROM node:18-slim

# Apply env globally for lightningcss during all child processes
ENV LIGHTNINGCSS_DISABLE_NATIVE=true

# Set working directory
WORKDIR /app

# Copy only package manifests first to install deps
COPY package*.json ./

# Force env for sub-subdeps and install deps
RUN LIGHTNINGCSS_DISABLE_NATIVE=true npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose app port
EXPOSE 3000

# Run dev
CMD ["npm", "run", "dev"]
