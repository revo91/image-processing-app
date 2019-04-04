import React from 'react';
import Dropzone from '../components/Dropzone';
import renderer, { act } from 'react-test-renderer';
import Typography from '@material-ui/core/Typography'
import { SnackbarProvider } from 'notistack';
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library'

const { getByText } = render(<SnackbarProvider maxSnack={1}>
    <Dropzone maxSize={5120000} multiple={false} accept=".jpg,.jpeg,.png,.tif,.tiff "/>
    </SnackbarProvider>);

it('changes view on DragEnter', async () => {
    fireEvent.dragEnter(getByText(/Przeciągnij/i))
    await waitForElement(()=>getByText(/Upuść tutaj/i))
});

it('changes view back on DragLeave', async () => {
    fireEvent.dragLeave(getByText(/Upuść tutaj/i))
    await waitForElement(()=>getByText(/Przeciągnij/i))
});
