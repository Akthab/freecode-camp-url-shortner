require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const urls = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
	res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
	var url = req.body.url;

	const { hostname } = new URL(url);

	dns.lookup(hostname, (err) => {
		if (err) {
			res.json({ error: 'invalid url' });
		} else {
			const shortUrl = Object.keys(urls).length + 1;
			urls[shortUrl] = url;
			res.json({ original_url: url, short_url: shortUrl });
		}
	});
});

app.get('/api/shorturl/:short_url', (req, res) => {
	const shortUrl = req.params.short_url;
	const url = urls[shortUrl];
	if (url) {
		res.redirect(url);
	} else {
		res.json({ error: 'short url not found' });
	}
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
