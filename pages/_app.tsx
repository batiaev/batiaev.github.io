import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Copyright from '../src/components/Copyright';
import theme from '../src/styles/theme';
import '../src/styles/global.css'

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
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
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
            <Copyright />
          </ThemeProvider>
    </>
  );
}