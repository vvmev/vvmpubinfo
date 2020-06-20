# VVM Pub Info

This docker image uses [Puppeteer](https://github.com/puppeteer/puppeteer) to take screenshots of some of our pages, and a simple JS based slide show to show them and the current webcam pictures.

The image runs on a central server. A public info display running Chrome in kiosk mode displays this page.

## Building

```
docker build -t vvmpubinfo:latest .
```

## Running Locally

```
docker run --rm -it -p 8080:80 vvmpubinfo:latest
```
