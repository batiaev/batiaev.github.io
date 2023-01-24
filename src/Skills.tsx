import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import Title from '../src/components/Title'
import data from '../src/data.json'

export default function Skills() {
  return (
    <section>
      <Title text="Skills" />
      <Grid container spacing={2} className="flexbox">
        {data.skills.map((skill, idx) => (
          <Grid item xs={12} sm={idx == 0 ? 12 : 6} md={4} key={idx}>
            <Card className="card">
              <CardContent>
                <Typography component="h3" variant="h5" className="centered" gutterBottom>
                  {skill.type}
                </Typography>
                <ul className="noBulletList">
                  {skill.areas.map((area, idx) => (
                    <Typography component="li" key={idx}>
                      {area.name}
                      <LinearProgress variant="determinate" value={area.value} />
                      <br />
                    </Typography>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  )
}
