import { Box, Button, Grid, Link as MuiLink, Typography } from '@mui/material'
import FieldForm from 'components/atoms/fields/FieldForm'
import FormWrapper, { FormData } from 'components/atoms/fields/FormWrapper'
import Icon from 'components/atoms/Icon'
import IconButton from 'components/atoms/IconButton'
import { __ } from 'helpers/i18n'
import useQuery from 'hook/useQuery'
import { useSelector } from 'react-redux'
import contactService from 'services/contactService'
import { RootState } from 'store/configureStore'
import { useSetting } from 'store/setting/settings.reducers'

const subjectList = {
    for_work: {
        title: __('Công việc')
    },
    report: {
        title: __('Báo cáo')
    },
    support: {
        title: __('Trợ giúp & hỗ trợ')
    },
    feedback: {
        title: __('Đóng góp ý kiến')
    },
    other: {
        title: __('Khác')
    },
};

type SubjectKey = keyof typeof subjectList;

function SectionContact({ subjectKey }: { subjectKey?: SubjectKey }) {

    const user = useSelector((state: RootState) => state.user);

    const settings = useSetting();

    const handleSubmit = async (post: FormData) => {
        const result = await contactService.postContact(post);

        if (result) {
            window.showMessage('Cảm ơn bạn đã để lại lời nhắn. Chúng tôi sẽ phản hồi bạn sớm nhất', 'success');
        }
    };

    const urlParams = useQuery({ subject: 'for_work' });

    return (<Grid
        container
        spacing={6}
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

            <Typography variant='h3' component='h2' >{__('Thông tin liên hệ')}</Typography>

            {
                Boolean(settings.contact?.office_address) &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                    }}
                >
                    <Typography variant='overline' component='h3' color="text.secondary">{__('Văn phòng chính')}</Typography>
                    <Typography sx={{ fontSize: 16 }}>{settings.contact?.office_address}</Typography>
                </Box>
            }

            {
                Boolean(settings.contact?.phone_number) &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                    }}
                >
                    <Typography variant='overline' component='h3' color="text.secondary">{__('Số điện thoại')}</Typography>
                    <MuiLink href={'tel: ' + settings.contact?.phone_number} sx={{ fontSize: 16 }}>{settings.contact?.phone_number}</MuiLink>
                </Box>
            }


            {
                Boolean(settings.contact?.email) &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                    }}
                >
                    <Typography variant='overline' component='h3' color="text.secondary">Email</Typography>
                    <MuiLink href={'mailto: ' + settings.contact?.email} sx={{ fontSize: 16 }}>{settings.contact?.email}</MuiLink>
                </Box>
            }
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
                        gap: 1,
                        ml: '-12px',
                    }}
                >
                    {
                        settings.contact?.social?.map((item, index) => (
                            <IconButton key={index} size="large" component={MuiLink} href={item.link} target='_blank' rel="nofollow">
                                <Icon size="large" icon={item.icon} />
                            </IconButton>
                        ))
                    }
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
                postDefault={{
                    subject: subjectKey ? subjectKey : urlParams.query.subject && subjectList[urlParams.query.subject as SubjectKey] ? urlParams.query.subject : 'for_work',
                    last_name: user ? user.full_name.split(' ').pop() : '',
                    first_name: user ? user.full_name.substring(0, user.full_name.lastIndexOf(" ")) : '',
                    email: user ? user.email : '',
                }}
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
                                        title: __('Họ'),
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
                                        title: __('Tên'),
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
                                title: __('Số điện thoại'),
                                rules: {
                                    require: true,
                                    isPhoneNumber: true,
                                }
                            }}
                            name="phone"
                        />
                    </Grid>
                    {
                        !subjectKey &&
                        <Grid
                            item
                            xs={12}
                            md={12}
                        >
                            <FieldForm
                                component='select'
                                config={{
                                    title: __('Chủ đề'),
                                    list_option: subjectList,
                                    rules: {
                                        require: true,
                                    }
                                }}
                                name="subject"
                            />
                        </Grid>
                    }
                    <Grid
                        item
                        xs={12}
                        md={12}
                    >
                        <FieldForm
                            component='textarea'
                            config={{
                                title: __('Nội dung'),
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
                        <Button size="large" type='submit' sx={{ width: 1 }} variant='contained'>
                            {__('Gửi liên hệ')}
                        </Button>
                    </Grid>



                </Grid>
            </FormWrapper>
        </Grid>
    </Grid>)
}

export default SectionContact