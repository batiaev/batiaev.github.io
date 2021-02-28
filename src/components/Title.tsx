import Typography from '@material-ui/core/Typography';

export default function Title({text}) {
  return (
    <Typography component="h2" variant="h2" align="center" color="textPrimary" className="title" gutterBottom>
        {text}
    </Typography>
  );
}