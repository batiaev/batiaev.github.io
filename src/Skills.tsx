import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import Title from '../src/components/Title'
import data from '../src/data.json'

export default function Skills() {
  return (
    <section>
      <Title text='Skills' />
      <Grid container spacing={2} className='flexbox'>
        {data.skills.map((skill, idx) => (
          <Grid item xs={12} sm={idx == 0 ? 12 : 6} md={4} key={idx}>
            <div className={`card skill-card bg-${skill.color}`}>
              <h3>{skill.type}</h3>
              <ul className='noBulletList'>
                {skill.areas.map((area, idx) => (
                  <Typography component='li' key={idx}>
                    {area.name}
                    <LinearProgress variant='determinate' value={area.value} />
                    <br />
                  </Typography>
                ))}
              </ul>
            </div>
          </Grid>
        ))}
      </Grid>
    </section>
  )
}
