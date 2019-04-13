import React, { Component } from 'react';
import './App.css';
import AppBar from './components/AppBar';
import 'typeface-roboto';
import Stepper from './components/Stepper';
import Grid from '@material-ui/core/Grid';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Dropzone from './components/Dropzone';
import MetadataTable from './components/MetadataTable';
import Tabs from './components/Tabs';
import SettingsTextFields from './components/Settings';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import ImageCard from './components/ImageCard';
import deepPurple from '@material-ui/core/colors/deepPurple';
import teal from '@material-ui/core/colors/teal';



const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: deepPurple,
    },
    typography: {
      useNextVariants: true,
    },
});

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit * 3
  },
  dropzone: {
    textAlign: 'center'
  }
});
//uploaded image data
let imageName;
let imageExtension;
let delay;

class App extends Component {
  state = {
    activeStep: 0,
    metadata: '',
    //image settings
    resolution: '',
    rotate: '',
    blur: '',
    gamma: '',
    sharpen: '',
    median: '',
    flipY: false,
    flipX: false,
    negate: false,
    normalize: false,
    grayscale: false,
    destinationFormat: '',
    removeAlpha: false,
    addAlpha: false,
    convolve: false,
    linear: false,
    recomb: false,
    //convolve matrix
    convolve00:'',
    convolve01:'',
    convolve02:'',
    convolve10:'',
    convolve11:'',
    convolve12:'',
    convolve20:'',
    convolve21:'',
    convolve22:'',
    convolve00Error:false,
    convolve01Error:false,
    convolve02Error:false,
    convolve10Error:false,
    convolve11Error:false,
    convolve12Error:false,
    convolve20Error:false,
    convolve21Error:false,
    convolve22Error:false,
    //recomb matrix
    recomb00:'',
    recomb01:'',
    recomb02:'',
    recomb10:'',
    recomb11:'',
    recomb12:'',
    recomb20:'',
    recomb21:'',
    recomb22:'',
    recomb00Error:false,
    recomb01Error:false,
    recomb02Error:false,
    recomb10Error:false,
    recomb11Error:false,
    recomb12Error:false,
    recomb20Error:false,
    recomb21Error:false,
    recomb22Error:false,
    //image settings error
    resolutionError: false,
    rotateError: false,
    blurError: false,
    gammaError: false,
    sharpenError: false,
    //uploaded image to display
    uploadedImage: '',
    //image preview live,
    imageProcessingPreview: '',
    //previewToggle
    previewToggle: 'processingPreview',
    //nextFileButton enabled/disabled,
    nextFileButtonDisabled: false,
    circularProgress: false,
    settingsDisabled: false
  }

  handlePreviewToggle = (state) => {
    this.setState({ previewToggle: state })
  }

  handleStepper = (step) => {
    this.setState({ activeStep: step })

    if (step === 2) {
      this.requestImageProcessing(...this.returnFinalProcessingState())
    }
    if (step === 0) {
      this.setState({
        resolution: '', rotate: '', blur: '', gamma: '', sharpen: '', flipY: false, flipX: false, negate: false,
        normalize: false, grayscale: false, destinationFormat: '', removeAlpha: false, addAlpha: false, imageProcessingPreview: '', 
        previewToggle: 'processingPreview', median: '', convolve: false, linear: false, recomb: false
      })
    }
  }

  returnProcessingPreviewState = () => {
    return [this.state.rotate, this.state.blur, this.state.gamma, this.state.sharpen, 
      this.state.flipY, this.state.flipX, this.state.negate, this.state.normalize, this.state.grayscale, this.state.median,
      this.returnConvolveMatrix(), this.state.linear, this.returnRecombMatrix()]
  }

  returnFinalProcessingState = () => {
    return [this.state.resolution, this.state.rotate, this.state.blur, this.state.gamma, this.state.sharpen, 
      this.state.flipY, this.state.flipX, this.state.negate, this.state.normalize, this.state.grayscale, this.state.median,
      this.returnConvolveMatrix(), this.state.linear, this.returnRecombMatrix(), this.state.destinationFormat, this.state.removeAlpha, this.state.addAlpha]
  }

  returnConvolveMatrix = () => {
    return [parseFloat(this.state.convolve00),
      parseFloat(this.state.convolve01),
      parseFloat(this.state.convolve02),
      parseFloat(this.state.convolve10),
      parseFloat(this.state.convolve11),
      parseFloat(this.state.convolve12),
      parseFloat(this.state.convolve20),
      parseFloat(this.state.convolve21),
      parseFloat(this.state.convolve22)]
  }

  returnRecombMatrix = () => {
    return [
      [parseFloat(this.state.recomb00), parseFloat(this.state.recomb01), parseFloat(this.state.recomb02)],
      [parseFloat(this.state.recomb10), parseFloat(this.state.recomb11), parseFloat(this.state.recomb12)],
      [parseFloat(this.state.recomb20), parseFloat(this.state.recomb21), parseFloat(this.state.recomb22)]
    ]
  }

  delayPreview = () => {
    clearTimeout(delay)
    delay = setTimeout(() => this.requestImageProcessingPreview(...this.returnProcessingPreviewState()), 2000)
  }

  handleMetadata = (metadata) => {
    this.setState({ metadata: metadata })
  }

  handleSettings = (name, value) => {
    switch (name) {
      case 'resolution':
        this.setState({ [name]: value, resolutionError: (value >= 1 && value <= 100) || value === '' ? false : true })
        break;
      case 'rotate':
        this.setState({ [name]: value, rotateError: (value >= -360 && value <= 360) || value === '' ? false : true }, 
        () => this.delayPreview())
        break;
      case 'blur':
        this.setState({ [name]: value, blurError: (value >= 1 && value <= 20) || value === '' ? false : true }, 
        () => this.delayPreview())
        break;
      case 'gamma':
        this.setState({ [name]: value, gammaError: (value >= 1 && value <= 3) || value === '' ? false : true }, 
        () => this.delayPreview())
        break;
      case 'sharpen':
        this.setState({ [name]: value, sharpenError: (value >= 1 && value <= 50) || value === '' ? false : true }, 
        () => this.delayPreview())
        break;
      case 'median':
        this.setState({ [name]: value, medianError: (value >= 1 && value <=5) || value === '' ? false : true },
        () => this.delayPreview())
      break;
      case 'convolve00':
      case 'convolve01':
      case 'convolve02':
      case 'convolve10':
      case 'convolve11':
      case 'convolve12':
      case 'convolve20':
      case 'convolve21':
      case 'convolve22':
        this.setState({ [name]: value, [`${name}Error`]: isNaN(value) ? true : false }, 
        () => {
          let notNull = true;
          [...this.returnConvolveMatrix()].map(x=>{
            if(isNaN(x))
            {
              notNull = false;
            }
          })
          if(notNull===true)
          {
            this.delayPreview()
          }
        })
        break;
      case 'recomb00':
      case 'recomb01':
      case 'recomb02':
      case 'recomb10':
      case 'recomb11':
      case 'recomb12':
      case 'recomb20':
      case 'recomb21':
      case 'recomb22':
      this.setState({ [name]: value, [`${name}Error`]: isNaN(value) ? true : false }, 
      () => {
        let notNull = true;
        [...this.returnRecombMatrix()].map(x=>{
          x.map(y=>{
            if(isNaN(y))
            {
              notNull = false;
            }
          })  
        })
        if(notNull===true)
        {
          this.delayPreview()
        }
      })
      break;
      
      case 'flipY':
      case 'flipX':
      case 'negate':
      case 'normalize':
      case 'grayscale':
      case 'linear':
      case 'recomb':
      case 'convolve':
      this.setState({ [name]: value }, () => this.requestImageProcessingPreview(...this.returnProcessingPreviewState()))
      break;
      default:
      this.setState({ [name]: value })
    }
  }

  handleUpload = (file) => {
    let split = file.name.split('.')
    imageExtension = split[split.length - 1]
    imageName = file.name.substring(0, file.name.length - imageExtension.length - 1)
    let uploadingInProgressSnackbar = this.props.enqueueSnackbar('Wysyłanie pliku...', { variant: 'info', persist: 'true' })
    let imageFile = new FormData();
    imageFile.append('file', file);
    axios({
      url: '/api/upload',
      method: 'POST',
      data: imageFile,
      headers:
      {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      if (res.status === 200) {
        this.handleStepper(1)
        let meta = res.data.metadata
        let preparedMeta = {
          'Format': meta.format,
          'Szerokość': meta.width,
          'Wysokość': meta.height,
          'Przestrzen': meta.space,
          'Kanały': meta.channels,
          'DPI': meta.density,
          'Progresywny': meta.isProgressive === true ? 'Tak' : 'Nie',
          'Przezroczystość': meta.hasAlpha === true ? 'Tak' : 'Nie'
        }
        this.setState({ metadata: preparedMeta })
        this.props.closeSnackbar(uploadingInProgressSnackbar)
        this.requestUploadedImageToDisplay()
      }
    })
  }

  requestUploadedImageToDisplay = () => {
    this.setState({ circularProgress: true, settingsDisabled: true })
    axios({
      url: '/api/getUploadedImage',
      method: 'POST',
    }).then(res => {
      let imageBinaries = res.data.binary.data
      let imgSrc = `data:image/jpeg;base64,${Buffer.from(imageBinaries).toString('base64')}`
      if (this.state.imageProcessingPreview === '') {
        this.setState({ uploadedImage: imgSrc, imageProcessingPreview: imgSrc, circularProgress: false, settingsDisabled: false })
      }
      else {
        this.setState({ uploadedImage: imgSrc, circularProgress: false, settingsDisabled: false })
      }
    })
  }

  requestImageProcessingPreview = (rotate, blur, gamma, sharpen, flipY, flipX, negate, normalize, grayscale, median, convolve, linear, recomb) => {
    if ((this.state.resolutionError || this.state.rotateError || this.state.blurError || this.state.gammaError || this.state.sharpenError) !== true) {
      this.setState({ circularProgress: true, settingsDisabled: true })
      let params = new URLSearchParams();
      params.append('doConvolve', this.state.convolve)
      params.append('doRecomb', this.state.recomb)
      params.append('rotate', rotate);
      params.append('blur', blur);
      params.append('gamma', gamma);
      params.append('sharpen', sharpen);
      params.append('flipY', flipY);
      params.append('flipX', flipX);
      params.append('negate', negate);
      params.append('normalize', normalize);
      params.append('grayscale', grayscale);
      params.append('median', median);
      convolve.map(x=>{
        params.append('convolve', x);
      })
      params.append('linear', linear);
      params.append('recomb', recomb);
      axios({
        url: '/api/getImagePreviewLive',
        method: 'POST',
        data: params,
      }).then(res => {
        let imageBinaries = res.data.binary.data
        this.setState({ imageProcessingPreview: `data:image/jpeg;base64,${Buffer.from(imageBinaries).toString('base64')}`, circularProgress: false, settingsDisabled: false })
      })
    }
  }

  requestImageProcessing = (resolution, rotate, blur, gamma, sharpen, flipY, flipX, negate, normalize, grayscale, median, convolve, 
    linear, recomb, format, removeAlpha, addAlpha) => {
    let renderingInProgressSnackbar = this.props.enqueueSnackbar('Trwa renderowanie pliku...', { variant: 'info', persist: 'true' })
    this.setState({ nextFileButtonDisabled: true })
    let params = new URLSearchParams();
    params.append('doConvolve', this.state.convolve)
    params.append('doRecomb', this.state.recomb)
    params.append('resolution', resolution);
    params.append('rotate', rotate);
    params.append('blur', blur);
    params.append('gamma', gamma);
    params.append('sharpen', sharpen);
    params.append('flipY', flipY);
    params.append('flipX', flipX);
    params.append('negate', negate);
    params.append('normalize', normalize);
    params.append('grayscale', grayscale);
    params.append('median', median);
    convolve.map(x=>{
      params.append('convolve', x);
    })
    params.append('linear', linear);
    params.append('recomb', recomb);
    params.append('format', format);
    params.append('removeAlpha', removeAlpha);
    params.append('addAlpha', addAlpha);
    axios({
      url: '/api/imageProcessing',
      method: 'POST',
      data: params,
    }).then(res => {
      let imageBinaries = res.data.binary.data;
      var bytes = new Uint8Array(imageBinaries);
      this.props.closeSnackbar(renderingInProgressSnackbar)
      this.setState({ nextFileButtonDisabled: false })
      const url = window.URL.createObjectURL(new Blob([bytes]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${imageName}_converted.${format !== '' ? format : imageExtension}`);
      document.body.appendChild(link);
      link.click();
    })
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
         <MuiThemeProvider theme={theme}>
        <AppBar></AppBar>
        <div className={classes.root}>
          <Grid
            container
            direction='row'
            justify='center'
            alignItems='center'
            spacing={24}>
            <Stepper
              activeStep={this.state.activeStep}
              uploadForm={<Grid item xs={12} >
                <Dropzone
                  acceptedFile={this.handleUpload}
                  uploadCompleted={this.handleStepper}
                  metadata={this.handleMetadata}>
                </Dropzone>
              </Grid>}
              metadata={<React.Fragment>
                <Grid item xs={12} >
                  <Tabs content={{
                    settings:
                      <React.Fragment>
                        <SettingsTextFields
                          textFieldsDisabled={this.state.settingsDisabled}
                          navigation={this.handleStepper}
                          //handle image settings
                          changeSettings={this.handleSettings}
                          //image settings from child
                          resolution={this.state.resolution}
                          rotate={this.state.rotate}
                          blur={this.state.blur}
                          gamma={this.state.gamma}
                          sharpen={this.state.sharpen}
                          flipY={this.state.flipY}
                          flipX={this.state.flipX}
                          negate={this.state.negate}
                          normalize={this.state.normalize}
                          grayscale={this.state.grayscale}
                          destinationFormat={this.state.destinationFormat}
                          removeAlpha={this.state.removeAlpha}
                          addAlpha={this.state.addAlpha}
                          median={this.state.median}
                          convolve={this.state.convolve}
                          linear={this.state.linear}
                          recomb={this.state.recomb}
                          recomb00={this.state.recomb00}
                          recomb01={this.state.recomb01}
                          recomb02={this.state.recomb02}
                          recomb10={this.state.recomb10}
                          recomb11={this.state.recomb11}
                          recomb12={this.state.recomb12}
                          recomb20={this.state.recomb20}
                          recomb21={this.state.recomb21}
                          recomb22={this.state.recomb22}
                          convolve00={this.state.convolve00}
                          convolve01={this.state.convolve01}
                          convolve02={this.state.convolve02}
                          convolve10={this.state.convolve10}
                          convolve11={this.state.convolve11}
                          convolve12={this.state.convolve12}
                          convolve20={this.state.convolve20}
                          convolve21={this.state.convolve21}
                          convolve22={this.state.convolve22}
                          //errors from child
                          resolutionError={this.state.resolutionError}
                          rotateError={this.state.rotateError}
                          blurError={this.state.blurError}
                          gammaError={this.state.gammaError}
                          sharpenError={this.state.sharpenError}
                          medianError={this.state.medianError}
                          recomb00Error={this.state.recomb00Error}
                          recomb01Error={this.state.recomb01Error}
                          recomb02Error={this.state.recomb02Error}
                          recomb10Error={this.state.recomb10Error}
                          recomb11Error={this.state.recomb11Error}
                          recomb12Error={this.state.recomb12Error}
                          recomb20Error={this.state.recomb20Error}
                          recomb21Error={this.state.recomb21Error}
                          recomb22Error={this.state.recomb22Error}
                          convolve00Error={this.state.convolve00Error}
                          convolve01Error={this.state.convolve01Error}
                          convolve02Error={this.state.convolve02Error}
                          convolve10Error={this.state.convolve10Error}
                          convolve11Error={this.state.convolve11Error}
                          convolve12Error={this.state.convolve12Error}
                          convolve20Error={this.state.convolve20Error}
                          convolve21Error={this.state.convolve21Error}
                          convolve22Error={this.state.convolve22Error}
                          //images preview
                          processedImagePreview={<ImageCard imgSrc={this.state.previewToggle === 'processingPreview' ? this.state.imageProcessingPreview : this.state.uploadedImage}
                            previewToggle={this.handlePreviewToggle}
                            circularProgress={this.state.circularProgress}></ImageCard>}
                        ></SettingsTextFields>
                      </React.Fragment>,
                    metadata: <MetadataTable metadata={this.state.metadata}></MetadataTable>
                  }}></Tabs>
                </Grid></React.Fragment>}
              completedStep={
                <Grid container spacing={24} className={classes.navButtons} justify='center'>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Button variant='contained' color='primary' fullWidth onClick={() => this.handleStepper(0)} disabled={this.state.nextFileButtonDisabled}>Kolejny plik</Button>
                  </Grid>
                </Grid>
              }
            >
            </Stepper>
          </Grid>
        </div>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withSnackbar(App));
