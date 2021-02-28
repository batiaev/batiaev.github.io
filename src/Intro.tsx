import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import GitHubIcon from '@material-ui/icons/GitHub';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CodeIcon from '@material-ui/icons/Code';
import SchoolIcon from '@material-ui/icons/School';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FacebookIcon from '@material-ui/icons/Facebook';
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';

import data from "../src/data.json"

export default function Intro() {
  const iconsByName = {
    'linkedin': <LinkedInIcon width='30px' />,
    'github': <GitHubIcon width='30px' />,
    'telegram': <TelegramIcon width='30px' />,
    'facebook': <FacebookIcon width='30px' />,
    'twitter': <TwitterIcon width='30px' />,

    'SchoolIcon': <SchoolIcon width='30px' />,
    'CodeIcon': <CodeIcon width='30px' />,
    'TrendingUpIcon': <TrendingUpIcon width='30px' />,
  }

  return (
    <Card className="intro" component="section">
      <img className="avatar" src={data.avatar} title={data.name}/>
      <div className="personalDetails">
        <CardContent>
          <Typography variant="h3" component="h1" color="textPrimary" gutterBottom>
            {data.name}
          </Typography>
          <Typography component="p" color="textPrimary" >
            {data.titles.join(', ')}
          </Typography>
          <ul className="noBulletList">
          {data.tags.map((tag) => (
            <Chip
              component="li"
              className="tags"
              icon={iconsByName[tag.icon]}
              label={tag.label}
              variant="outlined"
              color="primary"
            />
          ))}
          </ul>
          <Typography>
            {data.description}
          </Typography>
        </CardContent>
        <CardActions>
          {data.social.map((social) => (
              <IconButton color="primary" className="svgIcon" href={social.link}>
              {iconsByName[social.name]}
            </IconButton>
          ))}
        </CardActions>
      </div>
    </Card>
  );
}