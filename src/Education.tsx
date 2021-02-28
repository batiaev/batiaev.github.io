import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import SchoolIcon from '@material-ui/icons/School';
import Typography from '@material-ui/core/Typography';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Title from "../src/components/Title"
import data from "../src/data.json"

const useStyles = makeStyles((theme) => ({
  cardContent: {
    flexGrow: 1,
  },
  historyStart: {
    padding: theme.spacing(2),
  },
  historyLine: {
    paddingTop: theme.spacing(5),
  },
}));

export default function Education() {
  const classes = useStyles();
  
  return (
    <section>
      <Title text="Education" />

      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" className={classes.historyStart}>
              <SchoolIcon fontSize="large" width='30px' />
            </TimelineDot>
            <TimelineConnector className={classes.historyLine} />
          </TimelineSeparator>
          <TimelineContent />
        </TimelineItem>
        {data.education.map((edx) => (
          <TimelineItem>
            <TimelineOppositeContent className="wideOnly">
              <Typography color="textSecondary">{edx.period}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator className="wideOnly">
              <TimelineDot variant="default" color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Card className="card">
                <CardContent className={classes.cardContent}>
                  <Typography className="mobileOnly" color="textSecondary">{edx.period}</Typography>
                  <Typography component="h3" variant="h5" gutterBottom>
                    {edx.title}
                  </Typography>
                  <Typography>
                    @ {edx.company} • {edx.city}
                  </Typography>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}