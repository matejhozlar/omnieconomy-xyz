FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
COPY frontend/tsconfig.base.json ./

COPY frontend/packages ./packages

COPY frontend/apps ./apps

COPY frontend/public ./public

RUN npm ci

RUN npm run build

FROM node:20-alpine AS backend-builder

WORKDIR /app/server

COPY server/package*.json ./
COPY server/tsconfig.json ./

RUN npm ci

COPY server/src ./src

COPY server/fix-imports.js ./

RUN npm run build

RUN node fix-imports.js

FROM nginx:alpine AS frontend-client

COPY --from=frontend-builder /app/frontend/apps/client/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /health { \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine AS frontend-wiki

COPY --from=frontend-builder /app/frontend/apps/wiki/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /health { \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS backend

WORKDIR /app

COPY server/package*.json ./

RUN npm ci --production

COPY --from=backend-builder /app/server/dist ./dist

RUN mkdir -p logs

COPY --from=frontend-builder /app/frontend/apps/client/dist ./client
COPY --from=frontend-builder /app/frontend/apps/wiki/dist ./wiki

EXPOSE 5002

CMD ["node", "dist/server.js"]