import { Box, Typography, useTheme } from '@mui/material'
import Link from '@mui/material/Link'
import Divider from 'components/atoms/Divider'
import { AuthChildrenProps } from 'components/organisms/Auth'
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import { Link as LinkRouter } from 'react-router-dom'
import Google from './SignUpSocial/Google'

function SignIn({ tabName, handleChangeAuthTab }: AuthChildrenProps) {

    const theme = useTheme();

    // const navigate = useNavigate();

    // const [post, setPost] = React.useState({
    //     full_name: '',
    //     email: '',
    //     password: '',
    //     confirm_accept_promotional_emails: 0,
    // });

    // const handleSubmitForm = () => {
    //     (async () => {
    //         const respon: { error: boolean } = await ajax({
    //             url: '/account/sign-up',
    //             data: post,
    //         });

    //         if (!respon.error) {
    //             navigate(handleChangeAuthTab(tabName.logIn));
    //         }
    //     })()
    // }

    return (<Page
        title={__('Đăng ký')}
        description='Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.'
        image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                maxWidth: 500,
                margin: '0 auto',
                mt: 6.25,
            }}
        >
            <Typography variant='h2' component='h1'>
                {__('Đăng ký và bắt đầu học!')}
            </Typography>
            <Divider color='dark' />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mb: 3,
                }}
            >
                <Google />
                {/* <FieldForm
                    component='text'
                    config={{
                        title: 'Full Name',
                    }}
                    post={post}
                    name="full_name"
                    onReview={(value) => {
                        setPost(prevValue => ({
                            ...prevValue,
                            full_name: value
                        }))
                    }}

                />
                <FieldForm
                    component='email'
                    config={{
                        title: 'Email',
                    }}
                    post={post}
                    name="email"
                    onReview={(value) => {
                        setPost(prevValue => ({
                            ...prevValue,
                            email: value
                        }))
                    }}

                />
                <FieldForm
                    component='password'
                    config={{
                        title: 'Password',
                    }}
                    post={post}
                    name="password"
                    onReview={(value) => {
                        setPost(prevValue => ({
                            ...prevValue,
                            password: value
                        }))
                    }}

                />
                <FieldForm
                    component='true_false'
                    config={{
                        title: __('Yes! I want to get the most out of Udemy by receiving emails with exclusive deals, personal recommendations and learning tips!'),
                        isChecked: true,
                    }}
                    post={post}
                    name="confirm_accept_promotional_emails"
                    onReview={(value) => {
                        setPost(prevValue => ({
                            ...prevValue,
                            confirm_accept_promotional_emails: value
                        }))
                    }}

                /> */}
                {/* <Button
                    variant='contained'
                    onClick={handleSubmitForm}
                >
                    {__('Sign Up')}
                </Button> */}

                <Typography variant='body2' align='center'>
                    {
                        __('Bằng cách đăng ký, bạn đã đồng ý với ')
                    }
                    <Link style={{ color: theme.palette.link }} target="_blank" href="/terms/terms-of-use">{__('Điều khoản sử dụng')}</Link>
                    &nbsp;{__('và')}&nbsp;
                    <Link style={{ color: theme.palette.link }} target="_blank" href="/terms/privacy-policy">{__('Chính sách bảo mật')}</Link>.
                </Typography>

                <Divider color='dark' />

                <Typography variant='h4' align='center'>
                    {__('Bạn đã có tài khoản?')} <LinkRouter style={{ color: theme.palette.link }} to={handleChangeAuthTab(tabName.logIn)}>{__('Đăng nhập')}</LinkRouter>
                </Typography>


            </Box>
        </Box>
    </Page>
    )
}

export default SignIn