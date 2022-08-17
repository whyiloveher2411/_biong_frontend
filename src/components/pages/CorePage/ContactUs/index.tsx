import { Box, Button, Grid, Typography } from '@mui/material'
import FieldForm from 'components/atoms/fields/FieldForm'
import FormWrapper, { FormData } from 'components/atoms/fields/FormWrapper'
import Icon from 'components/atoms/Icon'
import IconButton from 'components/atoms/IconButton'
import Banner from 'components/molecules/Banner'
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import contactService from 'services/contactService'

function ContactUs() {

    const handleSubmit = async (post: FormData) => {
        const result = await contactService.postContact(post);

        if (result) {
            window.showMessage('Cảm ơn bạn, tin nhắn của bạn đã được nhận. Chúng tôi sẽ phản hồi bạn sớm nhất', 'success');
        }
    };

    return (<Page
        title={__('Contact Us')}
    >
        <Banner
            subTitle='học viện Spacedev.vn'
            title='Bạn có câu hỏi? Chúng tôi sẵn lòng giải đáp.'
            description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
            color='rgb(194, 228, 190)'
            image='/images/data/contact.jpg'
        />

        <Grid
            container
            spacing={3}
            sx={{
                pt: 4.25,
                mt: 8
            }}
        >
            <Grid
                item
                xs={12}
                md={5}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    gap: 4,
                }}
            >

                <Typography variant='h3' color="text.secondary" component='h2' >{__('Thông tin liên hệ')}</Typography>


                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                    }}
                >
                    <Typography variant='overline' component='h3' color="text.secondary">{__('Văn phòng chính')}</Typography>
                    <Typography sx={{ fontSize: 16 }}>258 Nam Ky Khoi Nghia, Q.3. TP.HCM</Typography>
                </Box>


                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                    }}
                >
                    <Typography variant='overline' component='h3' color="text.secondary">{__('Số điện thoại')}</Typography>
                    <Typography component='h3' sx={{ fontSize: 16 }}>(+84) 886871094</Typography>
                </Box>


                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                    }}
                >
                    <Typography variant='overline' component='h3' color="text.secondary">Email</Typography>
                    <Typography component='h3' sx={{ fontSize: 16 }}>dangthuyenquan@gmail.com</Typography>
                </Box>


                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}
                >
                    <Typography variant='overline' component='h3' color="text.secondary">{__('Kết nối với chúng tôi')}</Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1
                        }}
                    >
                        <IconButton>
                            <Icon icon="Facebook" />
                        </IconButton>
                        <IconButton>
                            <Icon icon="LinkedIn" />
                        </IconButton>
                        <IconButton>
                            <Icon icon="YouTube" />
                        </IconButton>
                    </Box>
                </Box>

            </Grid>

            <Grid
                item
                xs={12}
                md={7}
            >
                <FormWrapper
                    onFinish={handleSubmit}
                >
                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid
                            item
                            xs={12}
                            md={12}
                        >
                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                >
                                    <FieldForm
                                        component='text'
                                        config={{
                                            title: __('First Name'),
                                            rules: {
                                                require: true,
                                                // minLength: 6,
                                                maxLength: 30
                                            },
                                        }}
                                        name="first_name"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                >
                                    <FieldForm
                                        component='text'
                                        config={{
                                            title: __('Last Name'),
                                            rules: {
                                                require: true,
                                                // minLength: 6,
                                                maxLength: 30
                                            }
                                        }}
                                        name="last_name"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={12}
                        >
                            <FieldForm
                                component='email'
                                config={{
                                    title: __('Email'),
                                    rules: {
                                        require: true,
                                        isEmail: true,
                                    }
                                }}
                                name="email"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={12}
                        >
                            <FieldForm
                                component='text'
                                config={{
                                    title: __('Phone'),
                                    rules: {
                                        require: true,
                                        isPhoneNumber: true,
                                    }
                                }}
                                name="phone"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={12}
                        >
                            <FieldForm
                                component='select'
                                config={{
                                    title: __('Subject'),
                                    list_option: {
                                        for_work: {
                                            title: __('Công việc')
                                        },
                                        report: {
                                            title: __('Báo cáo')
                                        },
                                        other: {
                                            title: __('Khác')
                                        },
                                    },
                                    rules: {
                                        require: true,
                                    }
                                }}
                                name="subject"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={12}
                        >
                            <FieldForm
                                component='textarea'
                                config={{
                                    title: __('Message'),
                                    inputProps: {
                                        sx: {
                                            minHeight: 140,
                                            alignItems: 'flex-start',
                                        },
                                    },
                                    rules: {
                                        require: true,
                                    }
                                }}
                                name="message"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={12}
                        >
                            <Button type='submit' sx={{ width: 1 }} variant='contained'>
                                {__('Gửi liên hệ')}
                            </Button>
                        </Grid>



                    </Grid>
                </FormWrapper>
            </Grid>
        </Grid>

    </Page>)
}

export default ContactUs