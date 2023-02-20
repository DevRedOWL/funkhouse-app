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
