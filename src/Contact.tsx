import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TwitterIcon from '@material-ui/icons/Twitter'
import TelegramIcon from '@material-ui/icons/Telegram'
import EmailIcon from '@material-ui/icons/Email'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import RoomIcon from '@material-ui/icons/Room'
import Title from "../src/components/Title"
import data from "../src/data.json"

export default function Contact() {
  return (
    <section>
      <Title text="Contact me" />

      <Card className="flexbox">
        <CardContent className="centered">
          <img alt={data.name} src={data.avatar} className="contactAvatar" />
          <Typography component="h3" variant="h5">
            {data.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {data.titles.join(', ')}
          </Typography>
        </CardContent>

        <List component="nav" aria-label="main mailbox folders">
          <ListItem button key="1">
            <ListItemIcon>
              <EmailIcon width='30px' />
            </ListItemIcon>
            <ListItemText primary="Email me: anton@batiaev.com" />
          </ListItem>
          <ListItem button key="2">
            <ListItemIcon>
              <TelegramIcon width='30px' />
            </ListItemIcon>
            <ListItemText primary="Message me: @batiaev_com" />
          </ListItem>
          <ListItem button key="3">
            <ListItemIcon>
              <TwitterIcon width='30px' />
            </ListItemIcon>
            <ListItemText primary="Tweet me: @batiaev_com" />
          </ListItem>
          <ListItem button key="4">
            <ListItemIcon>
              <RoomIcon width='30px' />
            </ListItemIcon>
            <ListItemText primary="Meet me in person: Canart Wharf, London, UK" />
          </ListItem>
        </List>
      </Card>
    </section>
  );
}