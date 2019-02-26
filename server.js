const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const sharp = require('sharp');
const formidable = require('formidable');
const uploadDir = path.join(__dirname, '/uploaded_pics/');
const processedFilesDir = path.join(__dirname, '/processed_pics/')

let imageToProcessFile;
let imageToProcessMetadata;
let imageStream;
let imageName;
let imageExtension;
let processedFilePath;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/api/upload', (req, res) => {
  imageToProcessFile = null
  imageToProcessMetadata = null;
  imageStream = null;
  var form = new formidable.IncomingForm()
  form.multiples = true
  form.keepExtensions = true
  form.uploadDir = uploadDir
  form.parse(req, (err, fields, files) => {
    if (err) throw err;
  })
  form.on('fileBegin', function (name, file) {
    [imageName, imageExtension] = file.name.split('.')
    file.path = path.join(uploadDir, `${imageName}.${imageExtension}`)
  })
  form.on('file', function (name, file) {
    console.log('Uploaded ' + file.name);
    imageToProcessFile = path.join(uploadDir, file.name);

    imageStream = sharp(imageToProcessFile);

    imageStream.metadata()
      .then((metadata) => {
        imageToProcessMetadata = metadata;
        res.send({ metadata })
      })
  });
})


app.post('/api/imageProcessing', (req, res) => {
  let params = req.body;
  performImageProcessing(params).then((out) => {
    res.sendFile(out)
  })
})

//image processing methods
performImageProcessing = (params) => {
  console.log(params)
  return new Promise(function (resolve, reject) {
    params.resolution !== '' ? imageResize(params.resolution) : null;
    params.rotate !== '' ? imageRotate(params.rotate) : null;
    params.blur !== '' ? imageBlur(params.blur) : null;
    params.gamma !== '' ? imageGamma(params.gamma) : null;
    JSON.parse(params.flipY) ? imageFlipY() : null;
    JSON.parse(params.flipX) ? imageFlipX() : null;
    JSON.parse(params.negate) ? imageNegate() : null;
    JSON.parse(params.normalize) ? imageNormalize() : null;
    JSON.parse(params.grayscale) ? imageGrayscale() : null;
    params.colorspace !== '' ? imageColorspace(params.colorspace) : null;
    JSON.parse(params.removeAlpha) ? imageRemoveAlpha() : null;
    JSON.parse(params.addAlpha) ? imageAddAlpha() : null;

    // write to file
    processedFilePath = path.join(processedFilesDir, `${imageName}_converted.${imageExtension}`)
    imageStream.toFile(processedFilePath, (err, info) => { resolve(processedFilePath) })


  })
}

imageResize = (widthPercent) => {
  imageStream
    .resize({ width: Math.round(parseInt(widthPercent) * 0.01 * imageToProcessMetadata.width) })
}

imageRotate = (angle) => {
  imageStream
    .rotate(parseInt(angle))

}

imageBlur = (intensity) => {
  imageStream
    .blur(parseInt(intensity))
}

imageGamma = (intensity) => {
  imageStream
    .gamma(parseInt(intensity))
}

imageFlipY = () => {
  imageStream
    .flip()
}

imageFlipX = () => {
  imageStream
    .flop()
}

imageNegate = () => {
  imageStream
    .negate()

}

imageNormalize = () => {
  imageStream
    .normalize()

}

imageGrayscale = () => {
  imageStream
    .grayscale()

}

imageColorspace = (colorspace) => {
  console.log(colorspace)
  imageStream
    .toColorspace(colorspace)

}

imageRemoveAlpha = () => {
  imageStream
    .removeAlpha()

}

imageAddAlpha = () => {
  imageStream
    .ensureAlpha()

}

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));