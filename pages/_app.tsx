import * as React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline'
import Copyright from '../src/components/Copyright';
import defaultTheme from '../src/styles/theme'
import '../src/styles/global.css'
import createEmotionCache from '../utility/createEmotionCache'

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: AppProps) {
    // @ts-ignore
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
        <ThemeProvider theme={defaultTheme}>
            <Head>
                <title>Anton Batiaev - Fintech Developer, Derivatives Trader, MBA</title>
                <meta name="viewport"
                      content="minimum-scale=1, initial-scale=1, width=device-width" />

                <meta name="keywords"
                      content="cv, resume, Anton Batiaev, Batiaev, java developer, fintech,
          full stack java developer, spring developer, Oracle Certified, Oracle Certified developer, derivatives developer, quantitive developer, derivative trader"/>
                <meta name="author" content="Anton Batiaev"/>

                <meta property="og:title" content="Anton Batiaev - Certified Java Developer"/>
                <meta property="og:site_name" content="Anton Batiaev - Certified Java Developer"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://batiaev.com/"/>
                <meta property="og:see_also" content="https://www.linkedin.com/in/batiaev/"/>
                <meta property="og:image" content="https://batiaev.com/images/batiaev.webp"/>
                <meta property="og:description"
                      content="Anton Batiaev - Full Stack Certified Java Developer, involved in software development since 2010.
                Key skills: Java 8, Spring, Linux, Hibernate, Rabbit, Docker etc"/>

                <meta name="twitter:card" content="Anton Batiaev - Certified Java Developer"/>
                <meta name="twitter:site" content="@batiaev_com"/>
                <meta name="twitter:title" content="Anton Batiaev - Certified Java Developer"/>
                <meta name="twitter:description"
                      content="Anton Batiaev - Full Stack Certified Java Developer, involved in software development since 2010."/>
                <meta name="twitter:creator" content="@batiaev_com"/>
                <meta name="twitter:image" content="https://batiaev.com/images/batiaev.webp"/>
            </Head>

            <CssBaseline />
            <Component {...pageProps} />
            <Copyright />
        </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};
