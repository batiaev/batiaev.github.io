import Link from '@mui/material/Link'
import data from '../data/data.json'

export default function Copyright() {
  return (
    <footer>
      {`Copyright © 2013 — ${new Date().getFullYear()} `}
      <Link color="inherit" href="https://localhost:3000">
        {data.name}
      </Link>
      {'. All Rights Reserved.'}
    </footer>
  )
}
