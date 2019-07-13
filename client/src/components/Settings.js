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
import Button from '@material-ui/core/Button';
import '../App.css';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: "100%",
  },
  settingsSubheading: {
    marginTop: theme.spacing(4)
  },
  navButtons: {
    marginTop: theme.spacing(5)
  },
  sticky: {
    WebkitPosition: 'sticky', /* Safari */
    position: 'sticky',
    top: 10,
  },
  dividerGradient: {
    backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
  },
  gradientRightPrimary: {
    borderRight: `4px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing(4)
  },
  gradientRightSecondary: {
    borderRight: `4px solid ${theme.palette.secondary.main}`,
    marginBottom: theme.spacing(4)
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
        <Grid container spacing={4} justify="space-between">
          <Grid container item xs={12} sm={12} md={6} spacing={4}>
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
              <TextField
                id="sharpen"
                label="Wyostrzenie"
                className={classes.textField}
                value={this.props.sharpen}
                onChange={this.handleChange('sharpen')}
                margin="normal"
                helperText="Zakres 1.0 - 50.0"
                error={this.props.sharpenError}
                type="Number"
                disabled={this.props.textFieldsDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="median"
                label="Mediana"
                className={classes.textField}
                value={this.props.median}
                onChange={this.handleChange('median')}
                margin="normal"
                helperText="Zakres 3 - 20"
                error={this.props.medianError}
                type="Number"
                disabled={this.props.textFieldsDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="threshold"
                label="Progowanie"
                className={classes.textField}
                value={this.props.threshold}
                onChange={this.handleChange('threshold')}
                margin="normal"
                helperText="Zakres 1 - 255"
                error={this.props.thresholdError}
                type="Number"
                disabled={this.props.textFieldsDisabled}
              />
              </Grid>
            <Grid container item xs={12} spacing={4} className={classes.gradientRightPrimary}>
              <Grid item xs={12}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.props.convolve}
                        onChange={this.handleChange('convolve', true)}
                        value="convolve"
                        color="primary"
                        disabled={this.props.textFieldsDisabled}
                      />
                    }
                    label="Macierz konwolucji"
                  />
                </FormGroup>
              </Grid>
              {/* convolve 3x3 textfields */}

              <Grid item xs={4}>
                <TextField
                  id="convolve-0-0"
                  label="0-0"
                  className={classes.textField}
                  value={this.props.convolve00}
                  onChange={this.handleChange('convolve00')}
                  error={this.props.convolve00Error}
                  margin="dense"
                  type="Text"
                  disabled={this.props.textFieldsDisabled || !this.props.convolve}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="convolve-0-1"
                  label="0-1"
                  className={classes.textField}
                  value={this.props.convolve01}
                  onChange={this.handleChange('convolve01')}
                  error={this.props.convolve01Error}
                  margin="dense"
                  type="Text"
                  disabled={this.props.textFieldsDisabled || !this.props.convolve}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="convolve-0-2"
                  label="0-2"
                  className={classes.textField}
                  value={this.props.convolve02}
                  onChange={this.handleChange('convolve02')}
                  error={this.props.convolve02Error}
                  margin="dense"
                  type="Text"
                  disabled={this.props.textFieldsDisabled || !this.props.convolve}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="convolve-1-0"
                  label="1-0"
                  className={classes.textField}
                  value={this.props.convolve10}
                  onChange={this.handleChange('convolve10')}
                  error={this.props.convolve10Error}
                  margin="dense"
                  type="Text"
                  disabled={this.props.textFieldsDisabled || !this.props.convolve}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="convolve-1-1"
                  label="1-1"
                  className={classes.textField}
                  value={this.props.convolve11}
                  onChange={this.handleChange('convolve11')}
                  error={this.props.convolve11Error}
                  margin="dense"
                  type="Text"
                  disabled={this.props.textFieldsDisabled || !this.props.convolve}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="convolve-1-2"
                  label="1-2"
                  className={classes.textField}
                  value={this.props.convolve12}
                  onChange={this.handleChange('convolve12')}
                  error={this.props.convolve12Error}
                  margin="dense"
                  type="Text"
                  disabled={this.props.textFieldsDisabled || !this.props.convolve}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="convolve-2-0"
                  label="2-0"
                  className={classes.textField}
                  value={this.props.convolve20}
                  onChange={this.handleChange('convolve20')}
                  error={this.props.convolve20Error}
                  margin="dense"
                  type="Text"
                  disabled={this.props.textFieldsDisabled || !this.props.convolve}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="convolve-2-1"
                  label="2-1"
                  className={classes.textField}
                  value={this.props.convolve21}
                  onChange={this.handleChange('convolve21')}
                  error={this.props.convolve21Error}
                  margin="dense"
                  type="Text"
                  disabled={this.props.textFieldsDisabled || !this.props.convolve}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="convolve-2-2"
                  label="2-2"
                  className={classes.textField}
                  value={this.props.convolve22}
                  onChange={this.handleChange('convolve22')}
                  error={this.props.convolve22Error}
                  margin="dense"
                  type="Text"
                  disabled={this.props.textFieldsDisabled || !this.props.convolve}
                />
              </Grid>
              {/* convolve 3x3 textfields */}
            </Grid>


            {/* recomb 3x3 textfields */}
            <Grid container item xs={12} spacing={4} className={classes.gradientRightSecondary}>
              <Grid item xs={12}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.props.recomb}
                        onChange={this.handleChange('recomb', true)}
                        value="recomb"
                        color="primary"
                        disabled={this.props.textFieldsDisabled}
                      />
                    }
                    label="Macierz rekombinacji"
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  id="recomb-0-0"
                  label="0-0"
                  className={classes.textField}
                  value={this.props.recomb00}
                  onChange={this.handleChange('recomb00')}
                  error={this.props.recomb00Error}
                  margin="dense"
                  type="text"
                  disabled={this.props.textFieldsDisabled || !this.props.recomb}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="recomb-0-1"
                  label="0-1"
                  className={classes.textField}
                  value={this.props.recomb01}
                  onChange={this.handleChange('recomb01')}
                  error={this.props.recomb01Error}
                  margin="dense"
                  type="text"
                  disabled={this.props.textFieldsDisabled || !this.props.recomb}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="recomb-0-2"
                  label="0-2"
                  className={classes.textField}
                  value={this.props.recomb02}
                  onChange={this.handleChange('recomb02')}
                  error={this.props.recomb02Error}
                  margin="dense"
                  type="text"
                  disabled={this.props.textFieldsDisabled || !this.props.recomb}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="recomb-1-0"
                  label="1-0"
                  className={classes.textField}
                  value={this.props.recomb10}
                  onChange={this.handleChange('recomb10')}
                  error={this.props.recomb10Error}
                  margin="dense"
                  type="text"
                  disabled={this.props.textFieldsDisabled || !this.props.recomb}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="recomb-1-1"
                  label="1-1"
                  className={classes.textField}
                  value={this.props.recomb11}
                  onChange={this.handleChange('recomb11')}
                  error={this.props.recomb11Error}
                  margin="dense"
                  type="text"
                  disabled={this.props.textFieldsDisabled || !this.props.recomb}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="recomb-1-2"
                  label="1-2"
                  className={classes.textField}
                  value={this.props.recomb12}
                  onChange={this.handleChange('recomb12')}
                  error={this.props.recomb12Error}
                  margin="dense"
                  type="text"
                  disabled={this.props.textFieldsDisabled || !this.props.recomb}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="recomb-2-0"
                  label="2-0"
                  className={classes.textField}
                  value={this.props.recomb20}
                  onChange={this.handleChange('recomb20')}
                  error={this.props.recomb20Error}
                  margin="dense"
                  type="text"
                  disabled={this.props.textFieldsDisabled || !this.props.recomb}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="recomb-2-1"
                  label="2-1"
                  className={classes.textField}
                  value={this.props.recomb21}
                  onChange={this.handleChange('recomb21')}
                  error={this.props.recomb21Error}
                  margin="dense"
                  type="text"
                  disabled={this.props.textFieldsDisabled || !this.props.recomb}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="recomb-2-2"
                  label="2-2"
                  className={classes.textField}
                  value={this.props.recomb22}
                  onChange={this.handleChange('recomb22')}
                  error={this.props.recomb22Error}
                  margin="dense"
                  type="text"
                  disabled={this.props.textFieldsDisabled || !this.props.recomb}
                />
              </Grid>
              {/* recomb 3x3 textfields */}
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

              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.props.linear}
                      onChange={this.handleChange('linear', true)}
                      value="linear"
                      color="primary"
                      disabled={this.props.textFieldsDisabled}
                    />
                  }
                  label="Linear"
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
          <Grid container item xs={12} sm={12} md={6} spacing={4}>
            <Grid item xs={12}>
              <div className={classes.sticky}>
                <Typography variant="h6" className={classes.settingsSubheading}>Podgląd</Typography>
                {this.props.processedImagePreview}
              </div>
            </Grid>
          </Grid>
        </Grid>


        <Grid container spacing={6} className={classes.navButtons} justify="center">
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