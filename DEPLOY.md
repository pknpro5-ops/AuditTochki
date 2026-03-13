# Деплой AuditTochki на VPS (Beget)

## Первоначальная настройка на VPS

### 1. Установить Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Установить Chromium (для PDF генерации)

```bash
sudo apt-get install -y chromium-browser
```

### 3. Установить nginx (если ещё нет)

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

### 4. Клонировать проект

```bash
git clone https://github.com/pknpro5-ops/AuditTochki.git /opt/audittochki
cd /opt/audittochki
```

### 5. Настроить .env

```bash
cp .env.production.example .env
nano .env  # заполнить реальные ключи
```

### 6. Первый билд

```bash
npm ci
npx prisma generate
npx prisma db push
npm run build
```

### 7. Настроить systemd

```bash
sudo cp audittochki.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable audittochki
sudo systemctl start audittochki
```

### 8. Настроить nginx

```bash
sudo cp nginx-audittochki.conf /etc/nginx/sites-available/audittochki
sudo ln -s /etc/nginx/sites-available/audittochki /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 9. SSL сертификат

```bash
sudo certbot --nginx -d audittochki.ru -d www.audittochki.ru
```

### 10. Настроить GitHub Actions

В репозитории GitHub → Settings → Secrets → Actions:

- `VPS_HOST` = `155.212.226.155`
- `VPS_USER` = `root`
- `VPS_SSH_KEY` = содержимое приватного SSH-ключа

Сгенерировать ключ на VPS:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy  # скопировать в GitHub Secrets
```

## После настройки

Каждый `git push` в `master` автоматически:
1. Подтянет код на VPS
2. Установит зависимости
3. Сбилдит Next.js
4. Перезапустит сервис

## Полезные команды

```bash
# Логи приложения
sudo journalctl -u audittochki -f

# Статус
sudo systemctl status audittochki

# Ручной деплой
cd /opt/audittochki && bash deploy.sh
```
