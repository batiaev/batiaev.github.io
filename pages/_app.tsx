import * as React from 'react'
import PropTypes from 'prop-types'
import {AppProps} from 'next/app'
import '../src/global.css'
import Root from "../src/Root";
import data from '../src/data/data.json'
import Head from "next/head";

export default function MyApp(props: AppProps) {
    return (
        <>
            <Head>
                <title>{data.name} - CTO, Global Talent, MBA, Fintech Developer, Derivatives Trader</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
                <meta
                    property="description"
                    content={`${data.name} - CTO at WealthTech. MBA, UK Global Talent, Certified Java Developer, involved in software development since 2010.
                Key skills: Java 17, Spring, Linux, Kafka, Disruptor, Docker etc`}
                />
                <meta
                    name="keywords"
                    content="cv, resume, Anton Batiaev, Batiaev, java developer, fintech,
          full stack java developer, spring developer, Oracle Certified, Oracle Certified developer, derivatives developer, quantitive developer, derivative trader"
                />
                <meta name="author" content={data.name}/>

                <meta property="og:title" content={`${data.name} - CTO at WealthTech startup`}/>
                <meta
                    property="og:site_name"
                    content={`${data.name} - CTO at WealthTech startup`}
                />
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://batiaev.com/"/>
                <meta property="og:see_also" content="https://www.linkedin.com/in/batiaev/"/>
                <meta property="og:image" content="https://batiaev.com/images/batiaev.webp"/>
                <meta
                    property="og:description"
                    content={`${data.name} - CTO at WealthTech. MBA, UK Global Talent, Certified Java Developer, involved in software development since 2010.
                Key skills: Java 17, Spring, Linux, Kafka, Disruptor, Docker etc`}
                />

                <meta name="twitter:card" content={`${data.name} - CTO at WealthTech startup`}/>
                <meta name="twitter:site" content="@batiaev_com"/>
                <meta name="twitter:title" content={`${data.name} - CTO at WealthTech startup`}/>
                <meta
                    name="twitter:description"
                    content={`${data.name} - Full Stack Certified Java Developer, involved in software development since 2010.`}
                />
                <meta name="twitter:creator" content="@batiaev_com"/>
                <meta name="twitter:image" content="https://batiaev.com/images/batiaev.webp"/>
            </Head>
            <Root/>
        </>
    )
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
}
