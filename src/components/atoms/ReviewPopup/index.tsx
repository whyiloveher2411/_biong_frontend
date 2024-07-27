import { LoadingButton } from '@mui/lab';
import { Box, Rating, Typography } from '@mui/material';
import Dialog from 'components/molecules/Dialog';
import React, { ReactNode } from 'react';
import reviewService from 'services/reviewService';
import FieldForm from '../fields/FieldForm';
import FormWrapper from '../fields/FormWrapper';
import Icon from '../Icon';

function ReviewPopup({
  type,
  titlePopup,
  title,
  description,
  descriptionInpnutNote,
  placeholderInput,
  messageSuccess,
  handleAfterConfimReview,
  data,
  open,
  onClose
}: {
  type: string,
  titlePopup: string,
  title: ReactNode,
  description: ReactNode,
  descriptionInpnutNote: string,
  placeholderInput: string,
  messageSuccess: string,
  handleAfterConfimReview: (data: {
    rating: number,
    content: string,
  }) => void,
  data?: {
    post: ID,
    rating: number,
    content: string,
    is_incognito: number,
  },
  open: boolean,
  onClose: () => void,
}) {


  const formUpdateProfileRef = React.useRef<{
    submit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  }>(null);

  const dataReviewPopup = useReviewPopup();

  const [post, setPost] = React.useState({
    post: data?.post ?? 0,
    rating: data?.rating ?? 5,
    content: data?.content ?? '',
    // is_incognito: data?.is_incognito ? 1 : 0,
    is_incognito: 0,
  })

  const handleConfirmReview = (postForm: JsonFormat) => {
    dataReviewPopup.handleConfirmReview({
      ...post,
      content: postForm.content,
      type: type,
    }, messageSuccess);
  };

  return (
    <Dialog
      title={titlePopup}
      open={open}
      onClose={onClose}
      action={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <LoadingButton loading={dataReviewPopup.isOnProcess} loadingPosition="center" variant='contained' onClick={() => formUpdateProfileRef.current?.submit()}>{'Để lại đánh giá'}</LoadingButton>
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          '& textarea.MuiInputBase-input': {
            minHeight: '48px',
          }
        }}
      >
        <Typography variant="h4">{title}</Typography>
        <Typography sx={{ mt: 1, mb: 3, color: 'text.secondary', lineHeight: '26px' }}>
          {description}
        </Typography>

        <Typography variant='h5' sx={{ mb: 1 }}>Đánh giá của bạn sẽ được công khai</Typography>

        <Rating
          size="large"
          value={post.rating}
          // getLabelText={getLabelText}
          onChange={(_event, newValue) => {
            if (newValue) {
              setPost(prev => ({ ...prev, rating: newValue }));
            }
          }}
          // onChangeActive={(_event, newHover) => {
          //     setHover(newHover);
          // }}
          emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        {/* <Typography align='center'>
                    {post.rating !== null && (
                        labels[hover !== -1 ? hover : post.rating]
                    )}
                </Typography> */}
        <Box
          sx={{ mt: 3 }}
        >
          <FormWrapper
            postDefault={{
              ...post,
              // content: post.content ? post.content : template['template_' + post.rating as keyof typeof template] ? __(template['template_' + post.rating as keyof typeof template], {
              //     name: course.title
              // }) : ''
            }}
            ref={formUpdateProfileRef}
            onFinish={handleConfirmReview}
          >
            <FieldForm
              component='textarea'
              config={{
                title: 'Nội dung đánh giá',
                inputProps: {
                  placeholder: placeholderInput,
                },
                note: descriptionInpnutNote,
                rules: {
                  require: true,
                  minLength: 20,
                  maxLength: 255,
                },
              }}
              name="content"
              onReview={(value) => {
                setPost(prev => ({ ...prev, content: value }));
              }}
            />
            {/* <Box
                        sx={{ mt: 1 }}
                    >
                        <FieldForm
                            component='true_false'
                            config={{
                                title: 'Đăng ẩn danh',
                            }}
                            post={post}
                            name="is_incognito"
                            onReview={(value) => {
                                setPost(prev => ({
                                    ...prev,
                                    is_incognito: value ? 1 : 0,
                                }))
                            }}
                        />
                    </Box> */}
          </FormWrapper>
        </Box>
      </Box>
    </Dialog>
  )
}

export default ReviewPopup

export function useReviewPopup() {

  const [isOnProcess, setIsOnProcess] = React.useState(false);

  const handleConfirmReview = (data: {
    rating: number,
    content: string,
    type: string,
    post: ID,
  },
    messageSuccess: string,
    callbackAfterReview?: ((result: null | {
      result: boolean;
      meta: {
        rating: number;
        reviewNumber: number;
      };
    }) => void)
  ) => {

    setIsOnProcess(true);
    (async () => {
      const result = await reviewService.post(data);

      if (result) {
        window.showMessage(messageSuccess, 'success');
      }

      if (callbackAfterReview) {
        callbackAfterReview(result);
      }

      setIsOnProcess(false);
    })()
  };


  return {
    isOnProcess,
    handleConfirmReview,
  }
}