# 🚀 AASTU Academic Archive - Production Deployment Guide

## 📋 Prerequisites

Before deploying to production, ensure you have:

- ✅ Node.js 18+ and npm 9+
- ✅ PHP 8.1+ and Composer
- ✅ MySQL 8.0+ or PostgreSQL 13+
- ✅ Redis for caching and sessions
- ✅ SSL certificate for HTTPS
- ✅ Domain name configured
- ✅ Server with minimum 2GB RAM and 20GB storage

## 🔧 Frontend Production Setup

### 1. Install Production Dependencies

```bash
cd frontend
npm install --production
npm install -g pm2
```

### 2. Build Production Bundle

```bash
npm run build
```

### 3. Environment Configuration

Create `.env.production` file:

```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_WS_URL=wss://your-domain.com:6001
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### 4. PM2 Process Management

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'aastu-frontend',
    script: 'npm',
    args: 'start',
    cwd: './frontend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 5. Start Frontend

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 Backend Production Setup

### 1. Install Production Dependencies

```bash
cd backend
composer install --optimize-autoloader --no-dev
```

### 2. Environment Configuration

Create `.env.production` file:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aastu_production
DB_USERNAME=aastu_user
DB_PASSWORD=secure_password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="AASTU Academic Archive"

JWT_SECRET=your-super-secret-jwt-key
JWT_TTL=60
JWT_REFRESH_TTL=20160

WEBSOCKET_HOST=0.0.0.0
WEBSOCKET_PORT=6001
```

### 3. Database Setup

```bash
php artisan migrate --force
php artisan db:seed --class=ProductionSeeder
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 4. WebSocket Server Setup

Install Ratchet WebSocket library:

```bash
composer require cboden/ratchet
```

Create WebSocket service:

```bash
sudo nano /etc/systemd/system/aastu-websocket.service
```

Add content:

```ini
[Unit]
Description=AASTU WebSocket Server
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/aastu-academic-archive/backend
ExecStart=/usr/bin/php websocket_server.php
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start service:

```bash
sudo systemctl enable aastu-websocket
sudo systemctl start aastu-websocket
sudo systemctl status aastu-websocket
```

### 5. Queue Worker Setup

```bash
sudo nano /etc/systemd/system/aastu-queue.service
```

Add content:

```ini
[Unit]
Description=AASTU Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/aastu-academic-archive/backend
ExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3 --max-time=3600
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start service:

```bash
sudo systemctl enable aastu-queue
sudo systemctl start aastu-queue
```

## 🌐 Web Server Configuration

### 1. Nginx Configuration

Create `/etc/nginx/sites-available/aastu-academic-archive`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket
    location /ws {
        proxy_pass http://127.0.0.1:6001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files
    location /_next/static {
        alias /var/www/aastu-academic-archive/frontend/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/aastu-academic-archive /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔒 Security Configuration

### 1. Firewall Setup

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 6001/tcp
sudo ufw enable
```

### 2. Database Security

```sql
-- Create production user with limited privileges
CREATE USER 'aastu_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON aastu_production.* TO 'aastu_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. File Permissions

```bash
sudo chown -R www-data:www-data /var/www/aastu-academic-archive
sudo chmod -R 755 /var/www/aastu-academic-archive
sudo chmod -R 775 /var/www/aastu-academic-archive/backend/storage
sudo chmod -R 775 /var/www/aastu-academic-archive/backend/bootstrap/cache
```

## 📊 Monitoring & Logging

### 1. PM2 Monitoring

```bash
pm2 monit
pm2 logs
pm2 status
```

### 2. System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor system resources
htop
iotop
nethogs
```

### 3. Log Rotation

Create `/etc/logrotate.d/aastu-academic-archive`:

```
/var/www/aastu-academic-archive/backend/storage/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload aastu-queue
    endscript
}
```

## 🚀 Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Starting production deployment..."

# Pull latest changes
git pull origin main

# Frontend deployment
echo "📦 Building frontend..."
cd frontend
npm install --production
npm run build
pm2 restart aastu-frontend

# Backend deployment
echo "🔧 Setting up backend..."
cd ../backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart aastu-websocket
sudo systemctl restart aastu-queue
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
```

Make executable:

```bash
chmod +x deploy.sh
```

## 🔍 Health Checks

### 1. Frontend Health Check

```bash
curl -I https://your-domain.com
```

### 2. Backend Health Check

```bash
curl -I https://your-domain.com/api/health
```

### 3. WebSocket Health Check

```bash
curl -I https://your-domain.com:6001
```

## 📈 Performance Optimization

### 1. Redis Configuration

Edit `/etc/redis/redis.conf`:

```conf
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### 2. MySQL Optimization

Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
query_cache_size = 128M
query_cache_type = 1
```

### 3. Nginx Optimization

Edit `/etc/nginx/nginx.conf`:

```nginx
http {
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    client_max_body_size 100M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    keepalive_timeout 65;
    keepalive_requests 100;
}
```

## 🚨 Troubleshooting

### Common Issues:

1. **Session not persisting**: Check Redis connection and session configuration
2. **WebSocket connection failed**: Verify firewall rules and service status
3. **Export functionality not working**: Check file permissions and storage configuration
4. **Charts not rendering**: Verify Chart.js installation and bundle size
5. **Modal system errors**: Check React context providers and component mounting

### Debug Commands:

```bash
# Check service status
sudo systemctl status aastu-websocket
sudo systemctl status aastu-queue
sudo systemctl status nginx

# Check logs
sudo journalctl -u aastu-websocket -f
sudo journalctl -u aastu-queue -f
sudo tail -f /var/log/nginx/error.log

# Check processes
pm2 status
ps aux | grep php
ps aux | grep node
```

## 🎯 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Authentication works and sessions persist
- [ ] WebSocket connections establish successfully
- [ ] Export functionality works for all formats
- [ ] Charts render properly with real data
- [ ] Modal system functions correctly
- [ ] Permission system enforces access control
- [ ] Real-time updates work as expected
- [ ] Mobile responsiveness verified
- [ ] SSL certificate is valid and working
- [ ] Performance metrics are acceptable
- [ ] Error handling works gracefully
- [ ] Logs are being generated and rotated
- [ ] Backup system is configured
- [ ] Monitoring alerts are set up

## 🔄 Maintenance

### Regular Tasks:

1. **Daily**: Check service status and logs
2. **Weekly**: Review performance metrics and error logs
3. **Monthly**: Update dependencies and security patches
4. **Quarterly**: Review and optimize database queries
5. **Annually**: Full security audit and penetration testing

### Backup Strategy:

```bash
# Database backup
mysqldump -u aastu_user -p aastu_production > backup_$(date +%Y%m%d_%H%M%S).sql

# File backup
tar -czf files_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/aastu-academic-archive

# Automated backup script
0 2 * * * /usr/local/bin/backup_aastu.sh
```

---

**🎉 Congratulations! Your AASTU Academic Archive is now production-ready with enterprise-grade features, security, and performance optimizations.**
