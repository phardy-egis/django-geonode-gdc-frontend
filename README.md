# GDC (frontend)

This repository contains the source code for the frontend REACT app developped for GEONODE's GDC plugin.
GDC stands for Geo-data catalogue. It is a light and modern react front-end client for [GEONODE](https://github.com/GeoNode/geonode)

GDC Backend is based on à django app that adds specific endpoints to GEONODE base API.
This plugin is based on UIKit 3 and REACT and is compatible with versions of Geonode 4 and above.

![Plugin screenshot](https://github.com/Inogeo/gdc-frontend/master/README_SCREENSHOT.png?raw=true)

## Installation with GEONODE

Please refer to GDC (Backend) repository to install GDC plugin for Geonode.

## Developpement
### Start docker container
To run the container in development mode, use:
```
docker-compose run -p 3000:3000 gdc-frontend /bin/bash
```
### Run app in development server

This section explains how a new build of the app can be built.
Once the docker container is started, run the following command:
```
npm start
```
Once the development server is up and running on port 3000, you can reach the client at this url:
```
http://localhost:3000/?host=%%HOST_URL%%
```
You must replace the %%HOST_URL%% by the URL of your GEONODE's instance (ex: https://development.demo.geonode.org/)
On this instance, the GDC Backend plugin (Django App) should be installed and available.
### Build app
This section explains how a new build of the app can be built.
Once the docker container is started, run the following command:
```
npm build
```
