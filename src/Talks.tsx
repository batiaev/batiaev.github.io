import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Title from "../src/components/Title"
import data from "../src/data.json"
import siteData from "../src/site.json"

export default function Talks() {
  return (
    <section>
      <Title text={siteData.headers.talks} />
      <Grid container spacing={2} className="flexbox">
        {data.talks.map((talk) => (
          <Grid item key={talk.name} xs={12} sm={6} md={3}>
            <Card className="card">
              <CardMedia
                component="img"
                width="100%"
                image={talk.logo}
                title={talk.name}

              />
              <CardContent>
                <Typography component="h3" variant="h5" gutterBottom>{talk.name}</Typography>
                <Typography>{talk.desc}</Typography>
                <Typography component="p" variant="subtitle1">{talk.date}</Typography>
              </CardContent>
              <CardActions>
                {/* <Button size="small" color="primary">Video</Button> */}
                <Button href={talk.slides} size="small" color="primary">
                  {siteData.talks.slides}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}