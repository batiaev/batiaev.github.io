import React from 'react'
import Container from '@mui/material/Container'

import Contact from '../src/Contact'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import siteData from '../src/site.json'

export default function Error404() {
  return (
    <>
      <header />
      <Container component="main">
        <Card className="intro" component="section">
          <div className="personalDetails">
            <CardContent>
              <Typography
                variant="h3"
                component="h1"
                color="textPrimary"
                gutterBottom
                align={'center'}
              >
                {siteData.headers.error404}
              </Typography>
              <Typography align={'center'}>
                {siteData.headers.description404}{' '}
                <a href="https://github.com/batiaev/batiaev.github.io">@batiaev</a>
              </Typography>
            </CardContent>
            <CardActions></CardActions>
          </div>
        </Card>
        <Contact />
      </Container>
    </>
  )
}
