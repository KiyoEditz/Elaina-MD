FROM        --platform=$TARGETOS/$TARGETARCH node:24.21.0-bookworm-slim

LABEL       author="KiyoEditz" maintainer="https://github.com/KiyoEditz/Elaina-MD"

ENV         DEBIAN_FRONTEND=noninteractive \
            USER=container \
            HOME=/home/container \
            NODE_ENV=production \
            PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
            CHROME_BIN=/usr/bin/chromium

# Install system dependencies (multimedia, OCR, native build tools, and headless chromium libs)
RUN         apt-get update \
            && apt-get install -y --no-install-recommends \
               ffmpeg \
               imagemagick \
               graphicsmagick \
               webp \
               libwebp-dev \
               tesseract-ocr \
               tesseract-ocr-eng \
               tesseract-ocr-ind \
               git \
               sqlite3 \
               libsqlite3-dev \
               python3 \
               python3-dev \
               build-essential \
               ca-certificates \
               curl \
               wget \
               dnsutils \
               iproute2 \
               procps \
               tzdata \
               zip \
               tar \
               chromium \
               fonts-liberation \
               fonts-noto-color-emoji \
               libnss3 \
               libatk1.0-0 \
               libatk-bridge2.0-0 \
               libcups2 \
               libdrm2 \
               libgbm1 \
               libasound2 \
               libpango-1.0-0 \
               libx11-6 \
               libx11-xcb1 \
               libxcb1 \
               libxcomposite1 \
               libxcursor1 \
               libxdamage1 \
               libxext6 \
               libxfixes3 \
               libxi6 \
               libxrandr2 \
               libxrender1 \
               libxss1 \
               libxtst6 \
               xdg-utils \
               neofetch \
               sudo \
            && (curl -s https://install.speedtest.net/app/cli/install.deb.sh | bash && apt-get install -y speedtest && speedtest --accept-license || true) \
            && rm -rf /var/lib/apt/lists/* \
            && id -u container >/dev/null 2>&1 || useradd -m -d /home/container -s /bin/bash container

WORKDIR     /home/container

# Install dependencies first for optimal Docker layer caching
COPY        package*.json ./
RUN         npm install --omit=dev --legacy-peer-deps || npm install --legacy-peer-deps

# Copy application source code and entrypoint
COPY        . .
COPY        ./entrypoint.sh /entrypoint.sh

RUN         chmod +x /entrypoint.sh \
            && mkdir -p /home/container/data /home/container/session /home/container/tmp \
            && chown -R container:container /home/container /entrypoint.sh

USER        container

EXPOSE      3000

ENTRYPOINT  [ "/bin/bash", "/entrypoint.sh" ]
CMD         [ "node", "index.js" ]
