import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Title from "../src/components/Title"
import data from "../src/data.json"
import siteData from "../src/site.json"

export default function Talks() {
  return (
    <section>
      <Title text={siteData.headers.talks} />
      <Grid container spacing={2} className="flexbox">
        {data.talks.map((talk, index) => (
          <Grid item key={talk.name} xs={12} sm={index == 0 ? 12 : 6} md={ index == 0 || index == 1 ? 6 : 4}>
            <Card className="card">
              <CardMedia
                component="img"
                className="cardMedia"
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