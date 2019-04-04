import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { SnackbarProvider } from 'notistack';
import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SnackbarProvider maxSnack={1}><App /></SnackbarProvider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
