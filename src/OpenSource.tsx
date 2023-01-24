import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Title from '../src/components/Title'
import data from '../src/data.json'
import Link from '@mui/material/Link'

export default function OpenSource() {
  return (
    <section>
      <Title text="Open source" />
      <Grid container spacing={2} className="flexbox">
        {data.openSource.map((repo) => (
          <Grid item key={repo.name} xs={12} sm={6} md={3}>
            <Link href={repo.link}>
              <Card className="card">
                <CardMedia
                  component="img"
                  className="cardMedia"
                  width="100%"
                  image={repo.logo}
                  title={repo.name}
                />
                <CardContent>
                  <Typography component="h3" variant="h5" gutterBottom>
                    {repo.name}
                  </Typography>

                  <Typography>{repo.description}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </section>
  )
}
