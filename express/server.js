'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

// remote fn
const im = require('imagemagick');
const multer = require('multer');
const moment = require('moment');
const fs = require('fs');

const fail = message => {
  console.log(message)
  throw new Error(message)
}

const perform = (operation, args) =>
  new Promise((resolve, reject) =>
    im[operation](args, (err, res) => {
      if (err) {
        console.log(`${operation} operation failed:`, err)
        reject(err)
      } else {
        console.log(`${operation} completed successfully`)
        resolve(res)
      }
    })
  )
const postProcessResource = (resource, fn) => {
  let ret = null
  if (resource) {
    if (fn) {
      ret = fn(resource)
    }
    try {
      fs.unlinkSync(resource)
    } catch (err) {
      // Ignore
    }
  }
  return ret
}
const transform = async file => {
  // current time as string
  const date = moment().format('MMM Do YYYY, h:mm a')
  // transformation in imagemagick: resize to 314px, overlay text at x=5px, y=20px.
  const customArgs = [
    '-resize',
    '314x',
    '-fill',
    'blue',
    '-draw',
    `text 5,15 'Date cached: ${date}'`
  ]
  // prepare input and output files
  let inputFile = null
  let outputFile = null
  inputFile = '/tmp/inputFile.jpg'
  fs.writeFileSync(inputFile, file.buffer)

  customArgs.unshift(inputFile)
  outputFile = '/tmp/outputFile.jpg'
  customArgs.push(outputFile)
  // actual conversion
  try {
    const output = await perform('convert', customArgs)
    postProcessResource(inputFile)
    if (outputFile) {
      return postProcessResource(outputFile, file =>
        Buffer.from(fs.readFileSync(file))
      )
    }
    // Return the command line output as a debugging aid
    return output
  } catch (err) {
    fail('perform fail:', err)
  }
}


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


//

const router = express.Router();

// remote fn
router.post('/api/file', upload.fields([{ name: 'file' }]), function (req, res) {
  return transform(req.files.file[0])
    .then(result => {
      // return the image
      res.statusCode = 200
      res.headers = {
        'Content-Type': 'image/jpeg',
        'Content-Length': result.length
      }
      res.isBase64Encoded = true
      res.send(result)
    })
    .catch(error => {
      console.log(error)
      res.statusCode = 502
      res.headers = { 'Content-Type': 'application/json' }
      const body = `{"error": "Error manipulating image ${error}"}`
      res.send(body)
    })
})
//

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

//remote route



//


module.exports = app;
module.exports.handler = serverless(app);
