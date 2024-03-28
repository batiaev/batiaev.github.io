import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CodeIcon from "@mui/icons-material/Code";
import SchoolIcon from "@mui/icons-material/School";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import data from "../data/data.json";
import { isMobileOnly } from "react-device-detect";
import Link from "@mui/material/Link";
import { ReactElement } from 'react'

type MapType = {
    [id: string]: ReactElement;
}

export default function Intro() {
    const iconsByName: MapType = {
        'linkedin': <LinkedInIcon width="30px"/>,
        'github': <GitHubIcon width="30px"/>,
        'telegram': <TelegramIcon width="30px"/>,
        'facebook': <FacebookIcon width="30px"/>,
        'twitter': <TwitterIcon width="30px"/>,
        'calendar': <EventAvailableIcon width="30px"/>,
        'email': <EmailIcon width="30px"/>,

        'SchoolIcon': <SchoolIcon width="30px"/>,
        'CodeIcon': <CodeIcon width="30px"/>,
        'TrendingUpIcon': <TrendingUpIcon width="30px"/>,
        'EmojiEventsIcon': <EmojiEventsIcon width="30px"/>,
    }

    return (
        <Card className="intro" component="section">
            <div className={"intro-inner"}>
                <div className={`personalDetails ${isMobileOnly ? 'showContext' : ''}`} >
                    <CardContent>
                        <Typography variant="h3" component="h1" color="textPrimary" gutterBottom
                                    className={"gradient-title"}>
                            {data.name}
                        </Typography>
                        <Typography component="p" className={"gradient-subtitle"} color="textPrimary">
                            {data.titles.join(', ')} <br/>@ {data.company}
                        </Typography>
                        <ul className="noBulletList">
                            {data.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    component="li"
                                    className="tags"
                                    icon={iconsByName[tag.icon]}
                                    label={tag.label}
                                    variant="outlined"
                                    color="primary"
                                />
                            ))}
                        </ul>
                        <Typography>{data.description}</Typography>
                    </CardContent>
                    {!isMobileOnly ?
                        <CardActions>
                            {data.social.map((social, idx) => (
                                !social.hideTopMenu &&
                                <Link
                                    key={'social-' + idx}
                                    underline="none"
                                    href={social.link}
                                    aria-label={social.name}
                                >
                                    <Chip
                                        component="li"
                                        className="tags"
                                        icon={iconsByName[social.name]}
                                        label={social.name}
                                        variant="outlined"
                                        color="primary"
                                    />
                                </Link>
                            ))}
                        </CardActions>
                        : null}
                </div>
                <img className="avatar" src={data.avatar} title={data.name} alt={'avatar'}/>
            </div>
        </Card>
    )
}
