yarn install
node ace migration:run --force
node ace build --production --ignore-ts-errors
cd build
yarn install --production
cp ../.env .env
cd ..
pm2 kill
pm2 start ecosystem.config.js
