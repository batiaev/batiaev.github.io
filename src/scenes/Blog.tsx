import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Title } from "@components/Title";
import data from "../data/data.json";
import Chip from "@mui/material/Chip";
import { useState } from "react";
import Link from "@mui/material/Link";
import { deepPurple } from "@mui/material/colors";

export function Blog() {
  const [selectedItem, elevate] = useState("#");

  return (
    <section>
      <Title text="Blog" />
      <Grid container className="flexbox" spacing={2} >
        {data.blog.map((blog, index) => (
          <Grid
            item key={blog.name} lg={3} md={index === 0 ? 12 : 4} sm={6} xs={12}>
              <Link
                aria-label={blog.name}
                href={blog.link}
                underline="none"
              >
            <Card className="card"
                sx={selectedItem === blog.name ? { bgcolor: deepPurple[100] } : {}}
                onMouseOver={() => elevate(blog.name)}
                onMouseOut={() => elevate("none")}
                onSelect={() => elevate(blog.name)}
                onFocus={() => elevate(blog.name)}
                elevation={selectedItem === blog.name ? 4 : 1}
            >
              <CardMedia
                component="img"
                className="cardMedia"
                width="100%"
                image={blog.logo}
                title={blog.name}
              />
              <CardContent>
                <Typography component="h3" variant="h5" gutterBottom>
                  {blog.badge && <Chip label={blog.badge} color="primary" />} {blog.name}
                </Typography>
              </CardContent>
            </Card>
          </Link>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}
