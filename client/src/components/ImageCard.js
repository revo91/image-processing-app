import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  card: {
    maxHeight: 600
  },
  media: {
    objectFit: 'cover',
  },
  cardContent: {
    padding: 0
  }
});

class MediaCard extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            component="img"
            className={classes.media}
            image={this.props.imgSrc || 'https://place-hold.it/800x100'}
            title="Podgląd"
          />
          <CardContent className={classes.cardContent}>
            {this.props.circularProgress === true ? <CircularProgress className={classes.card}></CircularProgress> : null}
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={() => this.props.previewToggle('originalPreview')}>
            Oryginalny
        </Button>
          <Button size="small" color="primary" onClick={() => this.props.previewToggle('processingPreview')}>
            Podgląd zmian
        </Button>
        </CardActions>
      </Card>
    )
  }
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaCard);