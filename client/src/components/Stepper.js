import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
  stepContent: {
    textAlign: "Center"
  },
  stepperRoot: {
    padding: "0px",
    paddingTop: theme.spacing.unit * 3
  }
});



class VerticalLinearStepper extends React.Component {

  getSteps = () => {
    return ['Wybór pliku', 'Edycja', 'Pobieranie'];
  }

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return this.props.uploadForm
      case 1:
        return this.props.metadata;
      case 2:
        return this.props.completedStep;
      default:
        return 'Unknown step';
    }
  }

  render() {
    const { classes, activeStep } = this.props;
    const steps = this.getSteps();

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepperRoot}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent className={classes.stepContent}>
                {this.getStepContent(index)}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(VerticalLinearStepper);