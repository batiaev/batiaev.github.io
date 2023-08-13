import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Title from '../components/Title'
import data from '../data/data.json'
import siteData from '../data/site.json'
import Chip from '@mui/material/Chip'
import EventIcon from '@mui/icons-material/Event'
import YouTubeIcon from '@mui/icons-material/YouTube';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import Link from "@mui/material/Link";
import {useState} from "react";
import {deepPurple} from "@mui/material/colors";

export default function Talks() {
    const [selectedItem, elevate] = useState('')
    return (
        <section>
            <Title text={siteData.headers.talks}/>
            <Grid container spacing={2} className="flexbox">
                {data.talks.map((talk, index) => (
                    <Grid item key={talk.name} xs={12} sm={6}
                          md={index < 4 ? 6 : 4} lg={index >= 2 ? 3 : 6}>
                        <Link
                            underline="none"
                            href={talk.link}
                            aria-label={talk.name}
                        >
                            <Card className="card flexbox"
                                  sx={selectedItem == talk.name ? {bgcolor: deepPurple[100]} : {}}
                                  onMouseOver={() => elevate(talk.name)}
                                  onMouseOut={() => elevate('none')}
                                  onSelect={() => elevate(talk.name)}
                                  onFocus={() => elevate(talk.name)}
                                  elevation={selectedItem == talk.name ? 4 : 1}>
                                <CardMedia
                                    component="img"
                                    className="cardMedia"
                                    width="100%"
                                    image={talk.logo}
                                    title={talk.name}
                                />
                                <CardContent>
                                    <Typography component="h3" variant="h5"
                                                gutterBottom>
                                        {talk.name}
                                    </Typography>
                                    <Typography variant={'subtitle1'}
                                                component="p">
                                        {talk.desc}
                                    </Typography>
                                    <Typography component="p" paddingTop={2}>
                                        <Chip
                                            icon={
                                                talk.video && <YouTubeIcon/> ||
                                                talk.podcast &&
                                                <HeadphonesIcon/> ||
                                                <EventIcon/>}
                                            label={talk.date}
                                            variant="outlined"
                                            color={'primary'}
                                        />
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </section>
    )
}
