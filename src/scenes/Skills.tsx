import Title from '../components/Title'
import data from '../data/data.json'

export default function Skills() {
    return (
        <section>
            <Title text='Skills'/>
            <div>
                {data.skills.map((skill, idx) => (
                    <div key={'skill-' + idx}>
                        <h3>{skill.type}</h3>
                        <ul className='noBulletList'>
                            {skill.areas.map((area, idx) => (
                                <li key={idx}>
                                    {area.name}
                                    <span>{area.name}{area.value}</span>
                                    <br/>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {/*<Grid container spacing={2} className='flexbox'>*/}
            {/*  {data.skills.map((skill, idx) => (*/}
            {/*    <Grid item xs={12} sm={idx == 0 ? 12 : 6} md={4} key={idx}>*/}
            {/*      <div className={`card skill-card bg-${skill.color}`}>*/}
            {/*        <h3>{skill.type}</h3>*/}
            {/*        <ul className='noBulletList'>*/}
            {/*          {skill.areas.map((area, idx) => (*/}
            {/*            <Typography component='li' key={idx}>*/}
            {/*              {area.name}*/}
            {/*              <LinearProgress variant='determinate' value={area.value} aria-label={area.name}/>*/}
            {/*              <br />*/}
            {/*            </Typography>*/}
            {/*          ))}*/}
            {/*        </ul>*/}
            {/*      </div>*/}
            {/*    </Grid>*/}
            {/*  ))}*/}
            {/*</Grid>*/}
        </section>
    )
}
