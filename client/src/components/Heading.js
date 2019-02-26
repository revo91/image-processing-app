import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

class Heading extends Component {
  render() {
    return (
     <React.Fragment>
        <Typography variant="h2" gutterBottom>
          Edycja plików graficznych online
        </Typography>
     </React.Fragment>
    );
  }
}

export default Heading;

