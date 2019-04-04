import React from 'react';
import Stepper from '../components/Stepper';
import renderer from 'react-test-renderer';
import StepLabel from '@material-ui/core/StepLabel';

describe("Stepper component", () => {
    test("it shows expected steps when rendered", () => {
      const component = renderer.create(<Stepper activeStep={0}/>);
      const rootInstance = component.root
      const stepLabel = rootInstance.findAllByType(StepLabel)
      expect(stepLabel[0].props.children).toBe("Wybór pliku")
      expect(stepLabel[1].props.children).toBe("Edycja")
      expect(stepLabel[2].props.children).toBe("Pobieranie")
    });
  });
