const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const sharp = require('sharp');
const formidable = require('formidable');
const tempDir = path.join(__dirname, '/temp')
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let imageToProcessFile;
let imageToProcessMetadata;
let imageStream;
let imageName;
let imageExtension;
let processedFilePath;
let previewFile;

//create folders for uploading and processing
if (!fs.existsSync(tempDir)){
  fs.mkdirSync(tempDir);
}

//delete left-off files every 10 hours
deleteRemainingFiles = () => {
  fs.readdir(tempDir, function(err, files) {
    files.forEach(function(file, index) {
      fs.stat(path.join(tempDir, file), function(err, stat) {
        let endTime, now;
        if (err) {
          return console.error(err);
        }
        now = new Date().getTime();
        //delete older than 10 hours
        endTime = new Date(stat.ctime).getTime() + 36000000;
        if (now > endTime) {
          fs.unlink(path.join(tempDir, file), (err) => {
            if (err) throw err;
          });
        }
      });
    });
  });
}
setInterval(()=>deleteRemainingFiles(),36000000);


//endpoints
app.post('/api/upload', (req, res) => {
  imageToProcessFile = null
  imageToProcessMetadata = null;
  imageStream = null;
  let form = new formidable.IncomingForm()
  form.multiples = true
  form.keepExtensions = true
  form.uploadDir = tempDir
  form.parse(req, (err, fields, files) => {
    if (err) throw err;
  })
  form.on('fileBegin', function (name, file) {
    [imageName, imageExtension] = file.name.split('.')
    file.path = path.join(tempDir, `${imageName}.${imageExtension}`)
  })
  form.on('file', function (name, file) {
    console.log('Uploaded ' + file.name);
    imageToProcessFile = path.join(tempDir, file.name);
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
    res.on('finish',()=>{
      fs.unlink(out, (err) => {
        if (err) throw err;
      });
      fs.unlink(imageToProcessFile, (err) => {
        if (err) throw err;
      })
      fs.unlink(previewFile, (err) => {
        if (err) throw err;
      })
    })
  })
})

app.post('/api/getUploadedImage', (req, res) => {
  let params = req.body;
  let previewExtension = 'jpg'
  previewFile = path.join(tempDir, `${imageName}_preview.${previewExtension}`)
  if(imageToProcessMetadata.width>1000 || imageToProcessMetadata.height>1000)
  {
    imageToProcessMetadata.width>=imageToProcessMetadata.height?imageStream.resize({width: 1000}):imageStream.resize({height: 1000})
    imageStream.toFormat('jpg').toFile(previewFile, (err, info) => {
      res.sendFile(previewFile)
    })
  }
  else {
    res.sendFile(previewFile)
  }
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
    processedFilePath = path.join(tempDir, `${imageName}_converted.${imageExtension}`)
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
    console.log(imageStream)
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