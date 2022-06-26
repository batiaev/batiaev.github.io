import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Title from "../src/components/Title";
import data from "../src/data.json";

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
