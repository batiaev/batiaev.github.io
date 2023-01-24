import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Title from '../src/components/Title'
import data from '../src/data.json'
import { CardActions } from '@mui/material'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { useState } from 'react'

export default function Portfolio() {
  const [selectedItem, colorUp] = useState('#')

  return (
    <section>
      <Title text="Blog" />
      <Grid container spacing={2} className="flexbox">
        {data.blog.map((blog, index) => (
          <Grid item key={blog.name} xs={12} sm={6} md={index == 0 ? 12 : 4} lg={3}>
            <Card className="card">
              <CardMedia
                component="img"
                className="cardMedia"
                width="100%"
                image={blog.logo}
                title={blog.name}
              />
              <CardContent>
                <Typography component="h3" variant="h5" gutterBottom>
                  {blog.badge && <Chip label={blog.badge} color="primary" />} {blog.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant={blog.link == selectedItem ? 'contained' : 'outlined'}
                  href={blog.link}
                  onMouseOver={(e) => colorUp(blog.link)}
                  onMouseOut={(e) => colorUp('#')}
                >
                  Read more
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  )
}
