import React, { Component } from 'react';
import './App.css';
import AppBar from './components/AppBar';
import 'typeface-roboto';
import Stepper from './components/Stepper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Dropzone from './components/Dropzone';
import MetadataTable from './components/MetadataTable';
import Tabs from './components/Tabs';
import SettingsTextFields from './components/Settings';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import ImageCard from './components/ImageCard';


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

class App extends Component {
  state = {
    activeStep: 0,
    metadata: '',
    //image settings
    resolution: '',
    rotate: '',
    blur: '',
    gamma: '',
    flipY: false,
    flipX: false,
    negate: false,
    normalize: false,
    grayscale: false,
    destinationFormat: '',
    removeAlpha: false,
    addAlpha: false,
    //image settings error
    resolutionError: false,
    rotateError: false,
    blurError: false,
    gammaError: false,
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
    let imageParams = [this.state.resolution,
      this.state.rotate,
      this.state.blur,
      this.state.gamma,
      this.state.flipY,
      this.state.flipX,
      this.state.negate,
      this.state.normalize,
      this.state.grayscale,
      this.state.destinationFormat,
      this.state.removeAlpha,
      this.state.addAlpha]
      
    if (step === 2) {
      this.requestImageProcessing(...imageParams)
    }
    if (step === 0) {
      this.setState({resolution:'', rotate:'', blur: '', gamma:'', flipY: false, flipX: false, negate: false, 
      normalize: false, grayscale: false, destinationFormat: '', removeAlpha: false, addAlpha: false, imageProcessingPreview: '', previewToggle: 'processingPreview'})
    }
  }

  handleMetadata = (metadata) => {
    this.setState({ metadata: metadata })
  }

  handleSettings = (name, value) => {
    //this.setState({ [name]: value },()=>this.requestImageProcessingPreview(this.state.rotate, this.state.blur, this.state.gamma, this.state.flipY, this.state.flipX, this.state.negate, this.state.normalize, this.state.grayscale))
    switch (name) {
      case 'resolution':
        this.setState({ [name]: value, resolutionError: (value >= 1 && value <= 100) || value === '' ? false : true })
        break;
      case 'rotate':
        this.setState({ [name]: value, rotateError: (value >= -360 && value <= 360) || value === '' ? false : true },()=>this.requestImageProcessingPreview(this.state.rotate, this.state.blur, this.state.gamma, this.state.flipY, this.state.flipX, this.state.negate, this.state.normalize, this.state.grayscale))
        break;
      case 'blur':
        this.setState({ [name]: value, blurError: (value >= 1 && value <= 20) || value === '' ? false : true },()=>this.requestImageProcessingPreview(this.state.rotate, this.state.blur, this.state.gamma, this.state.flipY, this.state.flipX, this.state.negate, this.state.normalize, this.state.grayscale))
        break;
      case 'gamma':
        this.setState({ [name]: value, gammaError: (value >= 1 && value <= 3) || value === '' ? false : true },()=>this.requestImageProcessingPreview(this.state.rotate, this.state.blur, this.state.gamma, this.state.flipY, this.state.flipX, this.state.negate, this.state.normalize, this.state.grayscale))
        break;
      case 'flipY':
      case 'flipX':
      case 'negate':
      case 'normalize':
      case 'grayscale':
        this.setState({ [name]: value },()=>this.requestImageProcessingPreview(this.state.rotate, this.state.blur, this.state.gamma, this.state.flipY, this.state.flipX, this.state.negate, this.state.normalize, this.state.grayscale));
        break;
      case 'destinationFormat':
      case 'removeAlpha':
      case 'addAlpha':
        this.setState({ [name]: value })
        break;
      default:
        return null;
    }
  }

  handleUpload = (file) => {
    let split = file.name.split('.')
    imageExtension = split[split.length-1]
    imageName = file.name.substring(0,file.name.length-imageExtension.length-1)
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
    this.setState({circularProgress: true, settingsDisabled: true})
    axios({
      url: '/api/getUploadedImage',
      method: 'POST',
    }).then(res=> {
      let imageBinaries = res.data.binary.data
      let imgSrc = `data:image/jpeg;base64,${Buffer.from(imageBinaries).toString('base64')}`
      if(this.state.imageProcessingPreview==='')
      {
        
        this.setState({ uploadedImage: imgSrc, imageProcessingPreview: imgSrc, circularProgress: false, settingsDisabled: false })
      }
      else {
        this.setState({ uploadedImage: imgSrc, circularProgress: false, settingsDisabled: false })
      }
    })
  }

  requestImageProcessingPreview = (rotate, blur, gamma, flipY, flipX, negate, normalize, grayscale) => {
    if((this.state.resolutionError || this.state.rotateError || this.state.blurError || this.state.gammaError)!==true)
    {
      this.setState({circularProgress: true, settingsDisabled: true})
      let params = new URLSearchParams();
      params.append('rotate', rotate);
      params.append('blur', blur);
      params.append('gamma', gamma);
      params.append('flipY', flipY);
      params.append('flipX', flipX);
      params.append('negate', negate);
      params.append('normalize', normalize);
      params.append('grayscale', grayscale);
      axios({
        url: '/api/getImagePreviewLive',
        method: 'POST',
        data: params,

      }).then(res=> {
        let imageBinaries = res.data.binary.data
        this.setState({imageProcessingPreview: `data:image/jpeg;base64,${Buffer.from(imageBinaries).toString('base64')}`, circularProgress: false, settingsDisabled: false})
      })
    }
  }

    requestImageProcessing = (resolution, rotate, blur, gamma, flipY, flipX, negate, normalize, grayscale, format, removeAlpha, addAlpha) => {
      let renderingInProgressSnackbar = this.props.enqueueSnackbar('Trwa renderowanie pliku...', { variant: 'info', persist: 'true' })
      this.setState({nextFileButtonDisabled: true})
      let params = new URLSearchParams();
      params.append('resolution', resolution);
      params.append('rotate', rotate);
      params.append('blur', blur);
      params.append('gamma', gamma);
      params.append('flipY', flipY);
      params.append('flipX', flipX);
      params.append('negate', negate);
      params.append('normalize', normalize);
      params.append('grayscale', grayscale);
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
        this.setState({nextFileButtonDisabled: false})
        const url = window.URL.createObjectURL(new Blob([bytes]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${imageName}_converted.${format!==''?format:imageExtension}`);
        document.body.appendChild(link);
        link.click();
      })
    }
  
  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
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
                        flipY={this.state.flipY}
                        flipX={this.state.flipX}
                        negate={this.state.negate}
                        normalize={this.state.normalize}
                        grayscale={this.state.grayscale}
                        destinationFormat={this.state.destinationFormat}
                        removeAlpha={this.state.removeAlpha}
                        addAlpha={this.state.addAlpha}
                        //errors from child
                        resolutionError={this.state.resolutionError}
                        rotateError={this.state.rotateError}
                        blurError={this.state.blurError}
                        gammaError={this.state.gammaError}
                        //images preview
                        processedImagePreview={<ImageCard imgSrc={this.state.previewToggle==='processingPreview'?this.state.imageProcessingPreview:this.state.uploadedImage} 
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withSnackbar(App));
