import Title from '../components/Title'
import data from '../data/data.json'
import React from "react";

export default function Experience() {

    return (
        <section id={"experience"}>
            <Title text="Experience"/>
            <div className={"experience"}>
                {data.experiences.map((experience, idx) => (
                    <div key={'experience-' + idx}
                         className={`${idx === 0 ? "current-job" : (idx < 3 ? "key-jobs" : "")} ${experience.company}`}>
                        <div>
                            {experience.period}<br/>
                            {experience.duration ? ' · ' + experience.duration : ''}<br/>
                            {experience.title} @ {experience.company} • {experience.city}<br/>
                            {experience.description}<br/>
                            {experience.tags.map((tag, idx) => (
                                <div key={idx}>{tag}</div>
                            ))}
                        </div>
                        {experience.logo ? (<img src={experience.logo} alt={experience.company} width={'400px'}></img>) : null}
                    </div>
                ))}
            </div>
        </section>
    )
}
