# Express.js on Netlify Example

[![Netlify Status](https://api.netlify.com/api/v1/badges/01d82cdd-2a32-499c-b995-ee5b4b812852/deploy-status)](https://app.netlify.com/sites/dazzling-newton-866bef/deploys)

[![Deploy to
Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/rebeccapeltz/netlify-express-remote-fn)

An example of how to host an Express.js app on Netlify using
[serverless-http](https://github.com/dougmoscrop/serverless-http). See
[express/server.js](express/server.js) for details, or check it out at
https://netlify-express.netlify.com/!

[index.html](index.html) simply loads html from the Express.js app using
`<object>`, and the app is hosted at `/.netlify/functions/server`. Examples of
how to access the Express.js endpoints:

```sh
curl https://netlify-express.netlify.com/.netlify/functions/server
curl https://netlify-express.netlify.com/.netlify/functions/server/another
curl --header "Content-Type: application/json" --request POST --data '{"json":"POST"}' https://netlify-express.netlify.com/.netlify/functions/server
```
https://www.netlify.com/blog/2018/09/13/how-to-run-express.js-apps-with-netlify-functions/


curl https://dazzling-newton-866bef.netlify.app/.netlify/functions/server

curl https://dazzling-newton-866bef.netlify.app/.netlify/functions/server/another

curl --header "Content-Type: application/json" --request POST --data '{"json":"POST"}' https://dazzling-newton-866bef.netlify.app/.netlify/functions/server

curl https://dazzling-newton-866bef.netlify.app/.netlify/functions/server/api/file