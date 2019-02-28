import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  card: {
    //maxWidth: 345,
    margin: theme.spacing.unit * 3
  },
  media: {
    objectFit: 'cover',
  },
});

class MediaCard extends React.Component {
    render() {
        const { classes } = this.props;
        return(
        <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
        component="img"
        
          className={classes.media}
          image={this.props.imgSrc || 'https://place-hold.it/400.gif'}
          title="Podgląd"
        />
        {/* <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Lizard
          </Typography>
          <Typography component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography>
        </CardContent> */}
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={()=>this.props.previewToggle('originalPreview')}>
          Oryginalny
        </Button>
        <Button size="small" color="primary" onClick={()=>this.props.previewToggle('processingPreview')}>
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