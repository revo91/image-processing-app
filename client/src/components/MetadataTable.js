import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 300,
  },
});

class MetadataTable extends React.Component {

    render() {
        const { metadata, classes } = this.props;
        return(
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>Parametr</TableCell>
                    <TableCell align="right">Wartość</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {metadata!==''?
                Object.entries(metadata).map(([key, val]) => (
                    <TableRow key={Math.random()}>
                    <TableCell component="th" scope="row">
                        {key}
                    </TableCell>
                    <TableCell align="right">{val}</TableCell>
                    </TableRow>
                ))
                :null}
                </TableBody>
            </Table>
            </Paper>
        )
    }
}


MetadataTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MetadataTable);