import data from '../data/data.json'
import Link from "next/link";

export default function Copyright() {
  return (
    <footer>
      {`Copyright © 2013 — ${new Date().getFullYear()} `}
      <Link href="https://localhost:3000">
        {data.name}
      </Link>
      {'. All Rights Reserved.'}
    </footer>
  )
}
