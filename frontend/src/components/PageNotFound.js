import React from 'react';
import Paper from '@mui/material/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@mui/material/Typography';
const PageNotFound = () => {
  return <div><Container component="main" maxWidth="md" sx={{ mb: 4 }}>
  <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
      <Grid container spacing={2}>
          <Grid item xs={12} align="center">
              <Typography component='h3' variant='h3'>
                  Wystąpił błąd.
              </Typography>
          </Grid>
          <Grid item xs={12} align="center">
              <Typography component='h5' variant='h5'>
                  Strona której szukasz, nie istnieje.
              </Typography>
          </Grid>
        </Grid>
  </Paper>
</Container></div>;
};

export default PageNotFound;
