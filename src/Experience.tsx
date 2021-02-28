import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardContent from '@material-ui/core/CardContent';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import Typography from '@material-ui/core/Typography';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';

import { makeStyles } from '@material-ui/core/styles';
import Title from "../src/components/Title"
import data from "../src/data.json"

const useStyles = makeStyles((theme) => ({
  historyStart: {
    padding: theme.spacing(2),
  },
  historyLine: {
    paddingTop: theme.spacing(5),
  },
}));

export default function Experience() {
  const classes = useStyles();

  return (
    <section>
      <Title text="Experience" />
      <Timeline align="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" className={classes.historyStart}>
              <BusinessCenterIcon fontSize="large" width='30px' />
            </TimelineDot>
            <TimelineConnector className={classes.historyLine} />
          </TimelineSeparator>
          <TimelineContent>
          </TimelineContent>
        </TimelineItem>
        {data.experiences.map((experience) => (
          <TimelineItem>
            <TimelineOppositeContent className="wideOnly">
              <Typography color="textSecondary">{experience.period}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator className="wideOnly">
              <TimelineDot variant={experience.id == 1 ? "outlined" : "default"} color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Card className="card">
                <CardContent>
                  <Typography className="mobileOnly" color="textSecondary">{experience.period}</Typography>
                  <Typography component="h3" variant="h5" gutterBottom>
                    {experience.title}
                  </Typography>
                  <Typography>
                    @ {experience.company}
                  </Typography>
                  <Typography>
                    {experience.description}
                  </Typography>

                  {experience.tags.map((tag) => (
                    <Chip
                      label={tag}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}