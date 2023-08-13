import React from 'react'
import Contact from '../src/scenes/Contact'
import siteData from '../src/data/site.json'

export default function Error404() {
    return (
        <>
            <header/>
            <main>
                {siteData.headers.error404}
                {siteData.headers.description404}
            </main>
            <Contact/>
            {/*<Container component="main">
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
      </Container>*/}
        </>
    )
}
