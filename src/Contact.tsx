import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TwitterIcon from '@mui/icons-material/Twitter'
import TelegramIcon from '@mui/icons-material/Telegram'
import EmailIcon from '@mui/icons-material/Email'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import RoomIcon from '@mui/icons-material/Room'
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