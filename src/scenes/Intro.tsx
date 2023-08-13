import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CodeIcon from '@mui/icons-material/Code'
import SchoolIcon from '@mui/icons-material/School'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import FacebookIcon from '@mui/icons-material/Facebook'
import TelegramIcon from '@mui/icons-material/Telegram'
import TwitterIcon from '@mui/icons-material/Twitter'
import EmailIcon from '@mui/icons-material/Email'

import data from '../data/data.json'

export default function Intro() {
  const iconsByName = {
    linkedin: <LinkedInIcon width="30px" />,
    github: <GitHubIcon width="30px" />,
    telegram: <TelegramIcon width="30px" />,
    facebook: <FacebookIcon width="30px" />,
    twitter: <TwitterIcon width="30px" />,
    email: <EmailIcon width="30px" />,

    SchoolIcon: <SchoolIcon width="30px" />,
    CodeIcon: <CodeIcon width="30px" />,
    TrendingUpIcon: <TrendingUpIcon width="30px" />,
  }

  return (
    <Card className="intro" component="section">
      <img className="avatar" src={data.avatar} title={data.name} alt={'avatar'} />
      <div className="personalDetails">
        <CardContent>
          <Typography variant="h3" component="h1" color="textPrimary" gutterBottom className={"gradient-title"}>
            {data.name}
          </Typography>
          <Typography component="p" className={"gradient-subtitle"} color="textPrimary">
            {data.titles.join(', ')} at {data.company}
          </Typography>
          <ul className="noBulletList">
            {data.tags.map((tag, index) => (
              <Chip
                key={index}
                component="li"
                className="tags"
                // @ts-ignore
                icon={iconsByName[tag.icon]}
                label={tag.label}
                variant="outlined"
                color="primary"
              />
            ))}
          </ul>
          <Typography>{data.description}</Typography>
        </CardContent>
        <CardActions>
          {data.social.map((social, idx) => (
            <IconButton
              key={idx}
              color="primary"
              className="svgIcon"
              href={social.link}
              size="large"
              aria-label={social.name}
            >
              {
                // @ts-ignore
                iconsByName[social.name]
              }
            </IconButton>
          ))}
        </CardActions>
      </div>
    </Card>
  )
}
