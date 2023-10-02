import Card from "@mui/material/Card";

import { Title } from "@components/Title";
import data from "../data/data.json";
import {isMobileOnly} from "react-device-detect";
import Grid from "@mui/material/Unstable_Grid2";

export default function Experience() {

    return (
        <section id={"experience"}>
            <Title text="Experience"/>
            <Grid container spacing={4} className={"experience"}>
            {/*<div className={"experience"}>*/}
                {data.experiences.map((experience, idx) => (
                    <Grid key={'experience-' + idx} xs={12} sm={idx === 0 ? 12 : 6}
                          md={idx < 4 ? 6 : 4} lg={idx === 0 ? 12 : idx < 3 ? 6 : 4}>
                        <Card className={`card ${'experience-' + idx} ${idx === 0 ? "current-job" : (idx < 3 ? "key-jobs" : "other-jobs")}`}
                              >
                    {/*<div key={'experience-' + idx}*/}
                    {/*     className={`${'experience-' + idx} ${idx === 0 ? "current-job" : (idx < 3 ? "key-jobs" : "other-jobs")}`}>*/}
                        <div>
                            {experience.title} <br/>@ {experience.company} • {experience.city}<br/>
                            {experience.period}{idx >= 3 ? <br/> : null}
                            {experience.duration ? ' · ' + experience.duration : ''}<br/>
                            {isMobileOnly || idx >= 3 ? null : experience.description}
                        </div>
                        {experience.logo && idx !== 3 ? (
                            <img src={experience.logo} alt={experience.company}></img>) : null}
                    {/*</div>*/}
                        </Card>
                    </Grid>
                ))}
            {/*</div>*/}
            </Grid>
        </section>
    )
}
