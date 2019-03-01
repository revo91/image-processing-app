import React from 'react'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { withSnackbar } from 'notistack'

const styles = theme => ({
  uploadIcon: {
    fontSize: "200px",
  },
});

class MyDropzone extends React.Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length !== 0) {
      this.props.acceptedFile(acceptedFiles[0])
    }
    else {
      this.props.enqueueSnackbar('Nieobsługiwany format lub rozmiar pliku (>3 MB).', { variant: 'error' })
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Dropzone maxSize={3072000} onDrop={this.onDrop} multiple={false} accept=".jpg,.jpeg,.png,.tif,.tiff " >
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div
              {...getRootProps()}
              className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}
            >
              <input {...getInputProps()} />
              {

                <div><CloudUploadIcon color="primary" className={classes.uploadIcon}></CloudUploadIcon>
                  <Typography variant="h5" gutterBottom>
                    {!isDragActive ? "Przeciągnij lub wybierz plik graficzny" : "Upuść tutaj"}
                  </Typography>
                </div>
              }
            </div>
          )
        }}
      </Dropzone>
    );
  }
}

export default withStyles(styles)(withSnackbar(MyDropzone));