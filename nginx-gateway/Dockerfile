FROM nginx:alpine

# Copy custom nginx config
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 