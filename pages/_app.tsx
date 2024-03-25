import Head from "next/head";
import PropTypes from "prop-types";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import { Copyright } from "@components/Copyright";
import { theme as defaultTheme } from "../src/styles/theme";
import "../src/styles/global.css";
import data from "../src/data/data.json";
import createEmotionCache from "../utility/createEmotionCache";

const clientSideEmotionCache: EmotionCache = createEmotionCache();

export default function MyApp(props: AppProps) {
    // @ts-ignore
    const { Component, emotionCache = clientSideEmotionCache, pageProps }
        = props;

    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={defaultTheme}>
                <Head>
                    <title>
                        {data.name} - CTO, Global Talent, MBA, Fintech Developer, Derivatives Trader
                    </title>
                    <meta
                      content="minimum-scale=1, initial-scale=1, width=device-width"
                      name="viewport"
                    />
                    <meta
                      content={`${data.name} - CTO at WealthTech. MBA, UK Global Talent, Certified Java Developer, involved in software development since 2010.
                Key skills: Java 21, Spring, Linux, Kafka, Disruptor, Docker etc`}
                      property="description"
                    />
                    <meta
                        content={`cv, resume, ${data.name}, Batiaev, java developer, fintech,
          full stack java developer, spring developer, Oracle Certified, Oracle Certified developer, derivatives developer, quantitive developer, derivative trader`}
                        name="keywords"
                    />
                    <meta name="author" content={data.name} />

                    <meta property="og:title" content={`${data.name} - CTO at WealthTech`} />
                    <meta property="og:site_name" content={`${data.name} - CTO at WealthTech`} />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://batiaev.com/" />
                    <meta property="og:see_also" content="https://www.linkedin.com/in/batiaev/" />
                    <meta property="og:image" content="https://batiaev.com/images/batiaev.webp" />
                    <meta
                        content={`${data.name} - CTO at WealthTech. MBA, UK Global Talent, Certified Java Developer, involved in software development since 2010.
                Key skills: Java 21, Spring, Linux, Kafka, Disruptor, Docker etc`}
                        property="og:description"
                    />

                    <meta name="twitter:card" content={`${data.name} - CTO at WealthTech`} />
                    <meta name="twitter:site" content="@batiaev_com" />
                    <meta name="twitter:title" content={`${data.name} - CTO at WealthTech`} />
                    <meta
                        content={`${data.name} - CTO at WealthTech, involved in software development since 2010.`}
                        name="twitter:description"
                    />
                    <meta name="twitter:creator" content="@batiaev_com" />
                    <meta name="twitter:image" content="https://batiaev.com/images/batiaev.webp" />
                </Head>

                <CssBaseline/>
                <Component {...pageProps} />
                <Copyright/>
            </ThemeProvider>
        </CacheProvider>
    )
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
}
