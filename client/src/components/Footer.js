import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

class Footer extends Component {
    render() {
      return (
       <React.Fragment>
            <Link href="https://github.com/revo91">
                Made by Pawel Kosowski @revo91
            </Link>
       </React.Fragment>
      );
    }
  }
  
  export default Footer;