# ── BUILD STAGE ──
FROM node:18-alpine AS builder
WORKDIR /app

# ── COPY package.json and lock ──
COPY package*.json ./
RUN npm install

COPY . .
RUN npx expo export --platform web --output-dir web-build

# ── PRODUCTION STAGE ──
FROM nginx:alpine
COPY --from=builder /app/web-build /usr/share/nginx/html

# ── Expose frontend port ──
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]