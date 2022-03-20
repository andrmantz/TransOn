"use strict";
const next = require('next');
const nextConfig = require('./next.config');
const nextApp = next({
	dev: false,
	dir: __dirname,
	conf: nextConfig,
});
const handle = nextApp.getRequestHandler();
module.exports = async function (context, callback) {
	console.log(context.request.url);
	nextApp.prepare().then(() => handle(context.request, context.response));
}