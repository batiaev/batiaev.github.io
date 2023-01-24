import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import makeStyles from '@mui/styles/makeStyles'
import SchoolIcon from '@mui/icons-material/School'
import Typography from '@mui/material/Typography'

import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import Title from '../src/components/Title'
import data from '../src/data.json'

const useStyles = makeStyles(() => ({
  cardContent: {
    flexGrow: 1,
  },
  historyStart: {
    padding: '16px',
  },
  historyLine: {
    paddingTop: '40px',
  },
}))

export default function Education() {
  const classes = useStyles()

  return (
    <section>
      <Title text="Education" />

      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" className={classes.historyStart}>
              <SchoolIcon fontSize="large" width="30px" />
            </TimelineDot>
            <TimelineConnector className={classes.historyLine} />
          </TimelineSeparator>
          <TimelineContent />
        </TimelineItem>
        {data.education.map((edx, idx) => (
          <TimelineItem key={idx}>
            <TimelineOppositeContent className="wideOnly">
              <Typography color="textSecondary">{edx.period}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Card className="card">
                <CardContent className={classes.cardContent}>
                  <Typography className="mobileOnly" color="textSecondary">
                    {edx.period}
                  </Typography>
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
  )
}
