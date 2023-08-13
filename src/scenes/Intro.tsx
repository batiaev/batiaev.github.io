import data from '../data/data.json'

export default function Intro() {
    // const iconsByName = {
    //   linkedin: <LinkedInIcon width="30px" />,
    //   github: <GitHubIcon width="30px" />,
    //   telegram: <TelegramIcon width="30px" />,
    //   facebook: <FacebookIcon width="30px" />,
    //   twitter: <TwitterIcon width="30px" />,
    //   email: <EmailIcon width="30px" />,
    //
    //   SchoolIcon: <SchoolIcon width="30px" />,
    //   CodeIcon: <CodeIcon width="30px" />,
    //   TrendingUpIcon: <TrendingUpIcon width="30px" />,
    // }

    return (
        <section className={'intro'}>
            <div className={"intro-inner"}>
                <h1>{data.name}</h1>
                <div className={"default-title"}>
                <h2>{data.titles.join(', ')}</h2>
                <h3>at {data.company}</h3>
                </div>
            </div>
        </section>
        // <div>
        //   <img className="avatar" src={data.avatar} title={data.name} alt={'avatar'} />
        //     <div className="default-title">{data.name}</div>
        //   {data.titles.join(', ')}
        //   {data.tags.map((tag, index) => (
        //       <p key={'tag-'+ {index}}>{tag.label}</p>
        //   ))}
        //   {data.social.map((social, idx) => (
        //       <p key={'social-'+idx}>{social.name}</p>
        //   ))}
        // </div>
        // <Card className="intro" component="section">
        //   <img className="avatar" src={data.avatar} title={data.name} alt={'avatar'} />
        //   <div className="personalDetails">
        //     <CardContent>
        //       <Typography variant="h3" component="h1" color="textPrimary" gutterBottom className={"gradient-title"}>
        //         {data.name}
        //       </Typography>
        //       <Typography component="p" className={"gradient-subtitle"} color="textPrimary">
        //         {data.titles.join(', ')}
        //       </Typography>
        //       <ul className="noBulletList">
        //         {data.tags.map((tag, index) => (
        //           <Chip
        //             key={index}
        //             component="li"
        //             className="tags"
        //             icon={iconsByName[tag.icon]}
        //             label={tag.label}
        //             variant="outlined"
        //             color="primary"
        //           />
        //         ))}
        //       </ul>
        //       <Typography>{data.description}</Typography>
        //     </CardContent>
        //     <CardActions>
        //       {data.social.map((social, idx) => (
        //         <IconButton
        //           key={idx}
        //           color="primary"
        //           className="svgIcon"
        //           href={social.link}
        //           size="large"
        //           aria-label={social.name}
        //         >
        //           {iconsByName[social.name]}
        //         </IconButton>
        //       ))}
        //     </CardActions>
        //   </div>
        // </Card>
    )
}
