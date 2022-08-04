import React from 'react'
import Container from '@mui/material/Container'

import Intro from "../src/Intro"
import Skills from "../src/Skills"
import Services from "../src/Services"
import Education from "../src/Education"
import Experience from "../src/Experience"
import Blog from "../src/Blog"
import Contact from "../src/Contact"
import Talks from "../src/Talks"
import OpenSource from "../src/OpenSource"

export default function Index() {
  return (
    <>
      <header />
      <Container component="main">
        <Intro />
        <Skills />
        <Experience />
        <Talks />
        <Education />
        <OpenSource />
        <Services />
        <Blog />
        <Contact />
      </Container>
    </>
  );
}
