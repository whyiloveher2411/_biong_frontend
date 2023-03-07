// import { LoadingButton } from '@mui/lab'
import { Alert } from '@mui/lab'
import { Box, Link, Typography } from '@mui/material'
// import Divider from 'components/atoms/Divider'
import FieldForm from 'components/atoms/fields/FieldForm'
import FormWrapper, { FormData } from 'components/atoms/fields/FormWrapper'
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import useAjax from 'hook/useApi'
import React from 'react'
import { useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'
import { updateAccessToken } from 'store/user/user.reducers'
import Facebook from './LoginBySocial/Facebook'
// import Github from './LoginBySocial/Github'
import Google from './LoginBySocial/Google'
import LinkedIn from './LoginBySocial/LinkedIn'

function Login() {
    return (<Page
        title={__('Đăng nhập')}
        description='Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.'
        image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
    >
        <Box
            sx={{
                mt: 12,
            }}
        >
            <LoginForm />
        </Box>
    </Page >
    )
}

export default Login

export function LoginForm({ title }: { title?: string }) {

    const [data, setData] = React.useState({
        remameber_me: 0,
    });

    const dispatch = useDispatch();

    const useAjaxLogin = useAjax();

    const handleSubmitForm = (data: FormData) => {
        useAjaxLogin.ajax({
            url: '/vn4-account/login',
            data: data,
            success: (result: { error: boolean, access_token?: string }) => {
                if (!result.error && result.access_token) {
                    dispatch(updateAccessToken(result.access_token));
                }
            }
        })
    }

    return <FormWrapper
        onFinish={handleSubmitForm}
        postDefault={{
            remameber_me: 1
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 500,
                margin: '0 auto',
            }}
        >
            <Typography variant='h2' component='h1' sx={{ pb: 1 }}>
                {title ? title : __('Đăng ký / Đăng nhập')}
            </Typography>
            <Box>
                <FieldForm
                    component='true_false'
                    config={{
                        title: __('Duy trì đăng nhập'),
                        isChecked: true,
                    }}
                    name="remameber_me"
                    onReview={(value) => {
                        setData({
                            remameber_me: value ? 1 : 0
                        });
                    }}
                />
                <Typography sx={{ fontSize: 14 }}>
                    {__('Lưu lại thông tin đăng nhập và bạn không cần đăng nhập ở các lần truy cập sau.')}
                </Typography>
                <Alert icon={false} severity="info" sx={{ mt: 1 }}>
                    <Typography>
                        {__('Bằng việc đăng nhập vào hệ thống, bạn đã đồng ý với các điều khoản của chúng tôi')}. Xem thêm <Link target={'_blank'} href="/terms">tại đây</Link>
                    </Typography>
                </Alert>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Google data={data} />
                <LinkedIn data={data} />
                {/* <Github data={data} /> */}
                <Facebook data={data} />

            </Box>
        </Box>
    </FormWrapper>;
}