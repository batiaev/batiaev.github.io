import React from 'react'
import Title from '../components/Title'
import data from '../data/data.json'
import Link from "next/link";

export default function Contact() {
    return (
        <section id={"contact-us"} className={'contact-us'}>
            <Title text="Get In Touch"/>
            <div className={"social"}>
                {data.social.map(
                    (social, idx) =>
                        !social.hidden && (
                            <div key={'social' + social.id} id={'social' + social.id}>
                                <Link href={social.link}>{social.name}</Link>
                            </div>
                        )
                )}
            </div>
        </section>
    )
}
