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

const colorspaces = [
  {
    id: 'srgb',
    name: 'sRGB'
  },
  {
    id: 'rgb',
    name: 'RGB'
  },
  {
    id: 'cmyk',
    name: 'CMYK'
  },
  {
    id: 'lab',
    name: 'Lab'
  },
  {
    id: 'hsv',
    name: 'HSV'
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
        <Typography variant="h6" className={classes.settingsSubheading}>Zmiana wielkości obrazu</Typography>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
            />
          </Grid>
        </Grid>
        <Typography variant="h6" className={classes.settingsSubheading}>Operacje na obrazie</Typography>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
            />
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.flipY}
                    onChange={this.handleChange('flipY', true)}
                    value="flipY"
                    color="primary"
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
                  />
                }
                label="Normalizacja"
              />
            </FormGroup>
          </Grid>
        </Grid>
        <Typography variant="h6" className={classes.settingsSubheading}>Manipulacja kolorów</Typography>
        {/* <Grid container spacing={24}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
        <TextField
        id="colorspace"
        select
        label="Przestrzeń barw"
        className={classes.textField}
        value={this.props.colorspace}
        onChange={this.handleChange('colorspace')}
        margin="normal"
      >
        {colorspaces.map(option => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
      </Grid>
      </Grid> */}
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.grayscale}
                    onChange={this.handleChange('grayscale', true)}
                    value="grayscale"
                    color="primary"
                  />
                }
                label="Skala szarości"
              />
            </FormGroup>
          </Grid>
        </Grid>
        <Typography variant="h6" className={classes.settingsSubheading}>Manipulacja kanałów</Typography>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.removeAlpha}
                    onChange={this.handleChange('removeAlpha', true)}
                    value="removeAlpha"
                    color="primary"
                    disabled={this.props.addAlpha}
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
                    disabled={this.props.removeAlpha}
                  />
                }
                label="Dodaj kanał Alfa"
              />
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={24} className={classes.navButtons}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button fullWidth variant="outlined" color="secondary" onClick={() => this.props.navigation(0)}>
              Reset
        </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button fullWidth variant="outlined" color="primary" onClick={() => this.props.navigation(2)}
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