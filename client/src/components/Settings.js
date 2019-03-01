import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: "100%",
  },
  settingsSubheading: {
    marginTop: theme.spacing.unit * 4
  },
  navButtons: {
    marginTop: theme.spacing.unit * 5
  }
});

const formats = [
  {
    id: 'jpeg',
    name: 'JPEG'
  },
  {
    id: 'png',
    name: 'PNG'
  },
  {
    id: 'webp',
    name: 'WebP'
  },
  {
    id: 'tiff',
    name: 'TIFF'
  }
]

class Settings extends React.Component {

  handleChange = (name, checkbox = false) => event => {
    if (checkbox === true) {
      this.props.changeSettings(name, event.target.checked);
    }
    else {
      this.props.changeSettings(name, event.target.value);

    }
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <Grid container justify="space-between" spacing={8}>
          
          <Grid container item xs={12} sm={12} md={6} spacing={24}>
          <Typography variant="h6" className={classes.settingsSubheading}>Zmiana wielkości obrazu</Typography>
            <Grid item xs={12}>
              <TextField
                id="resolution"
                label="Rozdzielczość"
                className={classes.textField}
                value={this.props.resolution}
                onChange={this.handleChange('resolution')}
                margin="normal"
                helperText="Zakres 1 - 100%"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                error={this.props.resolutionError}
                type="Number"
                disabled={this.props.textFieldsDisabled}
              />
            </Grid>
            <Typography variant="h6" className={classes.settingsSubheading}>Operacje na obrazie</Typography>
            <Grid item xs={12}>
            <TextField
              id="rotate"
              label="Obrót"
              className={classes.textField}
              value={this.props.rotate}
              onChange={this.handleChange('rotate')}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">deg</InputAdornment>,
              }}
              error={this.props.rotateError}
              type="Number"
              disabled={this.props.textFieldsDisabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="blur"
              label="Rozmycie"
              className={classes.textField}
              value={this.props.blur}
              onChange={this.handleChange('blur')}
              margin="normal"
              helperText="Zakres intensywności 1 - 20"
              error={this.props.blurError}
              type="Number"
              disabled={this.props.textFieldsDisabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="gamma"
              label="Gamma"
              className={classes.textField}
              value={this.props.gamma}
              onChange={this.handleChange('gamma')}
              margin="normal"
              helperText="Zakres 1.0 - 3.0"
              error={this.props.gammaError}
              type="Number"
              disabled={this.props.textFieldsDisabled}
            />
          </Grid>
          <Grid item xs={12}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.flipY}
                    onChange={this.handleChange('flipY', true)}
                    value="flipY"
                    color="primary"
                    disabled={this.props.textFieldsDisabled}
                  />
                }
                label="Odwrócenie w poziomie"
              />
            </FormGroup>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.flipX}
                    onChange={this.handleChange('flipX', true)}
                    value="flipX"
                    color="primary"
                    disabled={this.props.textFieldsDisabled}
                  />
                }
                label="Odwrócenie w pionie"
              />
            </FormGroup>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.negate}
                    onChange={this.handleChange('negate', true)}
                    value="negate"
                    color="primary"
                    disabled={this.props.textFieldsDisabled}
                  />
                }
                label="Negatyw"
              />
            </FormGroup>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.normalize}
                    onChange={this.handleChange('normalize', true)}
                    value="normalize"
                    color="primary"
                    disabled={this.props.textFieldsDisabled}
                  />
                }
                label="Normalizacja"
              />
            </FormGroup>
          </Grid>
          <Typography variant="h6" className={classes.settingsSubheading}>Manipulacja kolorów</Typography>
          <Grid item xs={12}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.grayscale}
                    onChange={this.handleChange('grayscale', true)}
                    value="grayscale"
                    color="primary"
                    disabled={this.props.textFieldsDisabled}
                  />
                }
                label="Skala szarości"
              />
            </FormGroup>
          </Grid>
          <Typography variant="h6" className={classes.settingsSubheading}>Manipulacja kanałów</Typography>
          <Grid item xs={12}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.removeAlpha}
                    onChange={this.handleChange('removeAlpha', true)}
                    value="removeAlpha"
                    color="primary"
                    disabled={this.props.addAlpha || this.props.textFieldsDisabled}
                    
                  />
                }
                label="Usuń kanał Alfa"
              />
            </FormGroup>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.addAlpha}
                    onChange={this.handleChange('addAlpha', true)}
                    value="addAlpha"
                    color="primary"
                    disabled={this.props.removeAlpha || this.props.textFieldsDisabled}
                  />
                }
                label="Dodaj kanał Alfa"
              />
            </FormGroup>
          </Grid>
          <Typography variant="h6" className={classes.settingsSubheading}>Zapisz jako</Typography>
            <Grid item xs={12}>
              <TextField
              id="colorspace"
              select
              label="Format"
              className={classes.textField}
              value={this.props.destinationFormat}
              onChange={this.handleChange('destinationFormat')}
              margin="normal"
              helperText="Pozostaw puste aby zapisać w domyślnym formacie"
              disabled={this.props.textFieldsDisabled}
              >
              {formats.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
        </Grid>
          </Grid>
          <Grid container item xs={12} sm={12} md={6} spacing={24}>
            <Grid item xs={12}>
            <Typography variant="h6" className={classes.settingsSubheading}>Podgląd</Typography>
            {this.props.processedImagePreview}</Grid>
          </Grid>
        </Grid>
    
      
        <Grid container spacing={24} className={classes.navButtons} justify="center">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button fullWidth variant="contained" color="secondary" onClick={() => this.props.navigation(0)}>
              Reset
        </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button fullWidth variant="contained" color="primary" onClick={() => this.props.navigation(2)}
              disabled={this.props.resolutionError || this.props.rotateError || this.props.blurError || this.props.gammaError}>
              Dalej
        </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);