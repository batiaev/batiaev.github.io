import Title from '../components/Title'
import data from '../data/data.json'
import Link from "next/link";

export default function OpenSource() {

    return (
    <section>
      <Title text="Open source" />
        <div>
            <ul>
            {data.openSource.map((repo, idx) => (
                <li key={repo.name} >
                    <Link href={repo.link}>{repo.logo} {repo.name}</Link>
                </li>
            ))}
            </ul>
        </div>
    </section>
  )
}
