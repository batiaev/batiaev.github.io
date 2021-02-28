import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from "../src/components/Title"
import data from "../src/data.json"

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%'
  }
}));
export default function Portfolio() {
  const classes = useStyles();
  return (
    <section>
      <Title text="Blog" />
      <Grid container spacing={2} className="flexbox">
        {data.blog.map((blog, index) => (
          <Grid item key={blog.name} xs={12} sm={index == 0 ? 12 : 6} md={4}>
            <Link href={blog.link}>
            <Card className={classes.card}>
              <CardMedia
                component="img"
                width='100%'
                image={blog.logo}
                title={blog.name}
              /> 
              <CardContent>
                <Typography component="h3" variant="h5" gutterBottom>
                  {blog.name}
                </Typography>
              </CardContent>
            </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}