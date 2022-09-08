import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Title from "../src/components/Title";
import data from "../src/data.json";
import siteData from "../src/site.json";
import Chip from "@mui/material/Chip";
import EventIcon from "@mui/icons-material/Event";

export default function Talks() {
  return (
    <section>
      <Title text={siteData.headers.talks} />
      <Grid container spacing={2} className="flexbox">
        {data.talks.map((talk, index) => (
          <Grid item key={talk.name} xs={12} sm={index >= 1 ? 6 : 12} md={index >= 4 ? 4 : 6} lg={index >= 3 ? 3 : 4}>
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
                <Typography variant={"subtitle1"}>{talk.desc}</Typography>
                <Typography component="p" paddingTop={2}>
                  <Chip icon={<EventIcon />} label={talk.date} variant="outlined" color={"primary"} />
                </Typography>
              </CardContent>
              <CardActions>
                {talk.video && <Button href={talk.video} size={"small"} color={"primary"}>
                  {siteData.talks.video} ⟶
                </Button>}
                {talk.slides && <Button href={talk.slides} size="small" color="primary">
                  {siteData.talks.slides} ⟶
                </Button>}
                {talk.podcast && <Button href={talk.podcast} size="small" color="primary">
                  {siteData.talks.podcast} ⟶
                </Button>}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}
