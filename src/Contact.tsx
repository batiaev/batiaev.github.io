import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import EmailIcon from "@mui/icons-material/Email";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import PublicIcon from "@mui/icons-material/Public";
import Title from "../src/components/Title";
import data from "../src/data.json";
import { Avatar, Badge, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { deepPurple } from "@mui/material/colors";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

export default function Contact() {

  function getIcon(socialName) {
    switch (socialName) {
      case "github":
        return <GitHubIcon />;
      case "telegram":
        return <TelegramIcon />;
      case "facebook":
        return <FacebookIcon />;
      case "twitter":
        return <TwitterIcon />;
      case "linkedin":
        return <LinkedInIcon />;
      case "email":
        return <EmailIcon />;
      default:
        return <PublicIcon />;
    }
  }

  const [selectedItem, elevate] = useState("");


  function getTitle(name) {
    switch (name) {
      case "github":
        return "Show me code";
      case "telegram":
        return "Message me";
      case "facebook":
        return "Message me";
      case "twitter":
        return "Tweet me";
      case "linkedin":
        return "I am hiring";
      case "email":
        return "Email me";
      default:
        return "Contact me";
    }
  }

  return (
    <section>
      <Title text="Get In Touch" />
      <Grid container spacing={12}>
        {data.social.map((social, idx) => (
          !social.hidden &&
          <Grid item sm={6} lg={3}>
            <Paper elevation={selectedItem == social.name ? 4 : 1}
                   sx={{ textAlign: "center" }}
                   onMouseOver={e => elevate(social.name)}
                   onMouseOut={e => elevate("none")}
            >
              <Card sx={selectedItem == social.name ? { bgcolor: deepPurple[100] } : {}}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <Box sx={{ color: "action.active" }}>
                      <Badge color="secondary" variant="dot"
                             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                        <Avatar sx={{ bgcolor: deepPurple[600] }}>
                          {getIcon(social.name)}
                        </Avatar>
                      </Badge>
                    </Box>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {getTitle(social.name)}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    <Link href={social.link}>{social.id}</Link>
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}
