import React from 'react'
import Container from '@mui/material/Container'

import Intro from './scenes/Intro'
import Skills from './scenes/Skills'
import Services from './scenes/Services'
import Education from './scenes/Education'
import Experience from './scenes/Experience'
import Blog from './scenes/Blog'
import Contact from './scenes/Contact'
import Talks from './scenes/Talks'
import OpenSource from './scenes/OpenSource'

export default function Root() {
    return (
        <Container component="main">
            <Intro/>
            <Skills/>
            <Experience/>
            <Talks/>
            <Education/>
            <OpenSource/>
            <Services/>
            <Blog/>
            <Contact/>
        </Container>
    )
}
