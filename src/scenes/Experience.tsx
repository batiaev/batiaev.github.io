import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import Title from '../components/Title'
import data from '../data/data.json'
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import CardMedia from "@mui/material/CardMedia";

export default function Experience() {
    return (
        <section>
            <Title text="Experience"/>
            <Grid container spacing={2}>
                {data.experiences.map((experience, idx) => (
                    <Grid key={'experience-' + idx} xs={12} sm={idx === 0 ? 12 : 6}
                          md={idx < 4 ? 6 : 4} lg={idx === 0 ? 12 : idx > 2 ? 3 : 6}>
                        <Card className={`card ${'experience-' + idx}`}
                              sx={{display: 'flex', flexDirection: 'row', flexGrow: 1, bgcolor: experience.bgColor}}>
                            <CardContent sx={{display: 'flex', flexDirection: 'column'}}>
                                <Typography >
                                    {experience.period}{experience.duration ? ' · ' + experience.duration : ''}
                                </Typography>
                                <Typography component="h3" variant="h5" gutterBottom>
                                    {experience.title}
                                </Typography>
                                <Typography>
                                    {experience.period}{experience.duration ? ' · ' + experience.duration : ''}
                                </Typography>
                                <Typography>
                                    @ {experience.company} • {experience.city}
                                </Typography>
                                <Typography>{experience.description}</Typography>

                                {experience.tags.map((tag, idx) => (
                                    <Chip key={idx} label={tag} variant="outlined" color="primary"/>
                                ))}
                            </CardContent>
                            {experience.logo ?
                                <CardMedia
                                    component="img"
                                    // sx={{width: 151}}
                                    image={experience.logo}
                                    alt={experience.title}
                                /> : null}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </section>
    )
}
