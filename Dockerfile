FROM node:18-bookworm

RUN useradd -m app

# we install chromium to pull in all its dependencies; the actual copy used
# will be installed by puppeteer.
RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt install -y --no-install-recommends \
    chromium libgbm1 \
    cron \
    nginx \
  && dpkg -r chromium \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir /var/www/html/screenshots && chown app /var/www/html/screenshots

USER app
WORKDIR /home/app
RUN npm i puppeteer \
  && echo '13 * * * * SCREENSHOTDIR=/var/www/html/screenshots /home/app/screenshots.js' | crontab -
COPY screenshots.js /home/app

USER root
EXPOSE 80
COPY entrypoint /entrypoint
COPY html/ /var/www/html/

ENTRYPOINT [ "/entrypoint" ]
