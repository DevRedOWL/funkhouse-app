# Useful scripts

### Docker

```sh
docker compose up funkhouse-app --force-recreate --build -d
docker builder prune && docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
```

### Git

```
git reset --hard origin/master
```

# Making SSL

## Install certbot and launch it

```sh
brew install certbot
sudo certbot certonly --manual
```

## Add ACME challenge to code

```js
app.get("/.well-known/acme-challenge/:code", (req, res) => {
  res.send(`${req.params.code}.secret`);
});
```

## Copy files to ssl folder

```sh
sudo cp /etc/letsencrypt/live/HOST/fullchain.pem ./ssl/HOST.crt
sudo cp /etc/letsencrypt/live/HOST/privkey.pem ./ssl/HOST.key
```
