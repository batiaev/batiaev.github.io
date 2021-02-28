import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import Title from "../src/components/Title"
import data from "../src/data.json"

export default function Skills() {
  return (
    <section>
      <Title text="Skills" />
      <Grid container spacing={2} className="flexbox">

        {data.skills.map((skill) => (
          <Grid item xs={12} sm={6}>
            <Card className="card">
              <CardContent>
                <Typography component="h3" variant="h5" className="centered" gutterBottom>
                  {skill.type}
                </Typography>
                <ul className="noBulletList">
                {skill.areas.map((area) => (
                  <>
                    <Typography component="li">
                      {area.name}
                      <LinearProgress variant="determinate" value={area.value} />
                    </Typography>
                  </>
                ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}