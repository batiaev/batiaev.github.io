import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from "../src/components/Title"
import data from "../src/data.json"

export default function Portfolio() {
  return (
    <section>
      <Title text="Blog" />
      <Grid container spacing={2} className="flexbox">
        {data.blog.map((blog, index) => (
          <Grid item key={blog.name} xs={12} sm={6} md={index == 0 ? 12 : 4} lg={3}>
            <Link href={blog.link}>
            <Card className="card">
              <CardMedia
                component="img"
                className="cardMedia"
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