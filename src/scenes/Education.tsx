import Title from '../components/Title'
import data from '../data/data.json'
import Link from "next/link";

export default function Education() {
    // const classes = useStyles()

    return (
        <section>
            <Title text="Education"/>
            <div>
                {data.education.map((edx, idx) => (
                    <div key={'experience-' + idx}>
                        <Link href={edx.url}>{edx.period} {edx.city} {edx.company} {edx.title}</Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
