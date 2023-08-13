import React from 'react'
import Contact from '../src/scenes/Contact'
import siteData from '../src/data/site.json'

export default function Error404() {
    return (
        <>
            <header/>
            <main>
                {siteData.headers.error404}
                {siteData.headers.description404}
            </main>
            <Contact/>
        </>
    )
}
