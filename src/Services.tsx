import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Title from "../src/components/Title"
import data from "../src/data.json"

export default function Services() {
  return (
    <section>
      <Title text="Services" />
      <Grid container spacing={2} className="flexbox">
        {data.services.map((service) => (
          <Grid item key={service.name} xs={12} sm={6} md={3}>
            <Card className="card">
              <CardMedia
                component="img"
                width='100%'
                image={service.logo}
                title={service.name}
              />
              <CardContent>
                <Typography component="h3" variant="h5" gutterBottom>
                  {service.name}
                </Typography>

                <Typography>
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}