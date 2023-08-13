import Title from '../components/Title'
import data from '../data/data.json'
import siteData from '../data/site.json'
import {useState} from "react";
import Link from "next/link";
import {Container} from "@components/Container";

export default function Talks() {
    const [selectedItem, elevate] = useState('')
    return (
        <section>
            <Title text={siteData.headers.talks}/>
            <Container>
                {data.talks.map((talk, index) => (
                    <div key={'talk-' + index}>
                        <Link href={talk.link}>
                            <img
                                className="cardMedia"
                                width="100%"
                                src={talk.logo}
                                title={talk.name}
                            />
                            <div>
                                <h3>
                                    {talk.name}
                                </h3>
                            </div>
                        </Link>
                    </div>
                ))}
            </Container>
        </section>
    )
}
