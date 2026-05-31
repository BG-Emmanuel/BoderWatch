FROM node:20-alpine AS frontend
WORKDIR /app
COPY frontend-react/package.json ./
RUN npm install
COPY frontend-react/ ./
RUN npm run build

FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY gateway/nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend /app/dist /usr/share/nginx/html
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD wget --spider -q http://localhost/health || exit 1
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
