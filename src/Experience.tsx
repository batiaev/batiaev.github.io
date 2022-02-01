import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardContent from '@mui/material/CardContent';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Typography from '@mui/material/Typography';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import makeStyles from '@mui/styles/makeStyles';
import Title from "../src/components/Title"
import data from "../src/data.json"

const useStyles = makeStyles(() => ({
  historyStart: {
    padding: '16px',
  },
  historyLine: {
    paddingTop: "40px",
  },
}));

export default function Experience() {
  const classes = useStyles();

  return (
    <section>
      <Title text="Experience" />
      <Timeline position="alternate">
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
            <TimelineSeparator>
              <TimelineDot variant={experience.id == 1 ? "outlined" : "filled"} color="primary" />
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