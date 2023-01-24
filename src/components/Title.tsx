import Typography from '@mui/material/Typography'

export default function Title({ text }) {
  return (
    <Typography
      component="h2"
      variant="h2"
      align="center"
      color="textPrimary"
      paddingTop={2}
      className="title"
      gutterBottom
    >
      {text}
    </Typography>
  )
}
