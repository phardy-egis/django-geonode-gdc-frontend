docker-compose run gdc-frontend /bin/bash -c "npm run build"
rm -R /home/ubuntu/spade_v2/spade-reverseproxy/data/static/gdc/*
cp -R ./app/gdc-frontend/build/* /home/ubuntu/spade_v2/spade-reverseproxy/data/static/gdc
