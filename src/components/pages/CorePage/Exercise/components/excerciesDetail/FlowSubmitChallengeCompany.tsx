import { Box, Button, Typography } from '@mui/material'
import FieldForm from 'components/atoms/fields/FieldForm';
import FormWrapper from 'components/atoms/fields/FormWrapper';
import React from 'react'

function FlowSubmitChallengeCompany() {

  const [stepCurrent, setStepCurrent] = React.useState(0);

  const [dataSubmit, setĐataSubmit] = React.useState({
    company: '',
    position: '',
  })

  const totalStep = 5;

  const steps: React.ReactNode[] = [
    <>
      <Typography>Bạn đã từng thấy câu hỏi này trong một cuộc phỏng vấn thực tế trước đây chưa? {stepCurrent + 1}/{totalStep}</Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 1,
        }}
      >
        <Button size='small' variant='contained' onClick={() => setStepCurrent(prev => ++prev)}>Đã từng thấy</Button>
        <Button size='small' color="inherit" variant='contained'>Chưa gặp</Button>
      </Box>
    </>,
    <>
      <Typography>Công ty nào? {stepCurrent + 1}/{totalStep}</Typography>
      <FormWrapper
        postDefault={{
          company: dataSubmit.company
        }}
        onFinish={(data) => {
          setĐataSubmit(prev => ({ ...prev, company: data.company }));
          setStepCurrent(prev => ++prev)
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            pt: 1,
          }}
        >
          <FieldForm
            component='text'
            config={{
              title: 'Tên công ty',
              size: 'small',
              rules: {
                require: true,
              },
            }}
            name="company"
          />
          <Box>
            <Button variant='contained' type='submit'>Xác nhận</Button>
          </Box>
        </Box>
      </FormWrapper>
    </>,
    <>
      <Typography>Vị trí tuyển dụng {stepCurrent + 1}/{totalStep}</Typography>
      <Box>
        <FormWrapper
          postDefault={{
            position: dataSubmit.position
          }}
          onFinish={(data) => {
            setĐataSubmit(prev => ({ ...prev, position: data.position }));
            setStepCurrent(prev => ++prev);
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              pt: 1,
            }}
          >
            <Box
              sx={{ flex: 1 }}
            >
              <FieldForm
                component='select'
                config={{
                  title: false,
                  size: 'small',
                  rules: {
                    require: true,
                  },
                  list_option: {
                    junior: {
                      title: 'Junior Developer',
                    },
                    senior: {
                      title: 'Senior Developer',
                    },
                    fullstack: {
                      title: 'Full-stack Developer',
                    },
                    front_end: {
                      title: 'Front-end Developer',
                    },
                    back_end: {
                      title: 'Back-end Developer',
                    },
                    mobile: {
                      title: 'Mobile Developer',
                    },
                    devOps: {
                      title: 'DevOps',
                    },
                    tester: {
                      title: 'Tester',
                    },
                    data_scientist: {
                      title: 'Data Scientist',
                    },
                    machine_learning_engineer: {
                      title: 'Machine Learning Engineer',
                    },
                    cloud_engineer: {
                      title: 'Cloud Engineer',
                    },
                  },
                }
                }
                name="position"
              />
            </Box>
            <Box>
              <Button variant='contained' type='submit'>Xác nhận</Button>
            </Box>
          </Box>
        </FormWrapper>
      </Box>
    </>,
    <>
      <Typography>🎉 Cảm ơn phản hồi của bạn!</Typography>
    </>

  ]

  return (<Box>
    {
      steps[stepCurrent]
    }
  </Box>)
}

export default FlowSubmitChallengeCompany