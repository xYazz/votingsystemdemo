import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Skipper(props) {

  return (
    <Box sx={{ width: '100%' }}>
      {props.isHost?
      <Stepper activeStep={props.currentQuestion}>
        {props.questions.map((question, index) => {
          return (
            <Step key={question.pk}>
              <StepLabel>{question.question}</StepLabel>
            </Step>
          );
        })}
      </Stepper>:null}
          <Typography sx={{ mt: 2, mb: 1 }}>Pytanie {props.currentQuestion + 1}</Typography>
          <Typography sx={{ mt: 2, mb: 1 }}>Ilość oddanych głosów: {props.timesQuestionAnswered}</Typography>
    </Box>
  );
}