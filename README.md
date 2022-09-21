# GDC (frontend)

This repository contains the source code for the frontend REACT app developped for GEONODE's GDC plugin.
GDC (Geo-data catalogue) stands for a light and modern react front-end client for [GEONODE](https://github.com/GeoNode/geonode)
It is based on à django app that adds specific endpoints to GEONODE base API.
It is only compatible with versions of Geonode 4 and above.

## Installation with GEONODE

Please refer to GDC (Backend) repository to install GDC plugin on Geonode.

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

### Build app

This section explains how a new build of the app can be built.
Once the docker container is started, run the following command:
```
npm build
```
