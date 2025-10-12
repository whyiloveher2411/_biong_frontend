import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import generateShortVideoService, { IGenerateShortVideo } from 'services/generateShortVideoService';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';

const GenerateShortVideo = ({ subtab1 }: { subtab1: string }) => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    'Cài đặt',
    'Tạo script',
    'Chuyển thành voice',
    'Sinh video bằng AI',
    'Thêm phụ đề',
    'Chèn nhạc nền',
    'Render final video',
  ];

  const [generateShortVideo, setGenerateShortVideo] = useState<IGenerateShortVideo | null>(null);

  React.useEffect(() => {
    if (subtab1 && subtab1 !== 'new') {
      generateShortVideoService.getGenerateShortVideo(subtab1).then((res) => {
        setGenerateShortVideo(res);
      });
    } else {
      setGenerateShortVideo(null);
      setActiveStep(0);
    }
  }, [subtab1]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCreateNew = () => {
    navigate('/ai/generate-short-video/new');
  };

  const handleBackToList = () => {
    navigate('/ai/generate-short-video');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, mt: 2, justifyContent: 'space-between' }}>
        <Button color='inherit' startIcon={<ArrowBackIcon />} onClick={handleBackToList}>
          Danh sách video
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleCreateNew}
          startIcon={<AddIcon />}
        >
          Tạo mới
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Menu các bước bên trái */}
        <Paper
          elevation={3}
          sx={{
            width: 300,
            p: 3,
            height: 'fit-content',
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Các bước thực hiện
            </Typography>

          </Box>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Nội dung bước hiện tại bên phải */}
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            minHeight: 500
          }}
        >
          {activeStep === 0 && <Step1 onNext={handleNext} generateShortVideo={generateShortVideo} />}
          {activeStep === 1 && <Step2 onBack={handleBack} onNext={handleNext} />}
          {activeStep === 2 && <Step3 onBack={handleBack} onNext={handleNext} />}
          {activeStep === 3 && <Step4 onBack={handleBack} onNext={handleNext} />}
        </Paper>
      </Box>
    </Container>
  );
};

export default GenerateShortVideo;
