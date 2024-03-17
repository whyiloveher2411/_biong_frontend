import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { Box, Card, IconButton, Typography } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import FormWrapper, { FormData } from 'components/atoms/fields/FormWrapper';
import DrawerCustom from 'components/molecules/DrawerCustom';
import React from 'react';
function AppSettings() {

    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Card>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 3,
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography variant='h2' fontSize={18} fontWeight={700}>Ứng dụng học tiếng anh</Typography>
                        <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium adipisci ullam dolorum magni ipsa maiores et, est aspernatur cum, nemo quidem cumque ducimus eum suscipit. Doloribus repellendus eaque provident praesentium.</Typography>
                    </Box>

                    <Box>
                        <IconButton onClick={() => setOpen(true)}>
                            <ModeEditOutlineOutlinedIcon />
                        </IconButton>
                        <DrawerCustom
                            onCloseOutsite
                            open={open}
                            anchor='right'
                            width={600}
                            headerAction
                            title="Chỉnh sửa ứng dụng"
                            onClose={() => {
                                setOpen(false);
                            }}
                        >
                            <FormEditApplication />
                        </DrawerCustom>
                    </Box>
                </Box>

            </Card>
        </>
    )
}

export default AppSettings

function FormEditApplication() {

    const [post,] = React.useState<{ [key: string]: string }>({});

    const handleSubmit = (data: FormData) => {
        //
    }

    return <FormWrapper
        postDefault={post}
        onFinish={handleSubmit}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                pt: 3,
            }}
        >
            <FieldForm
                component='text'
                config={{
                    title: 'Tên ứng dụng',
                    rules: {
                        require: true,
                    },
                }}
                name="name"
            />

            <FieldForm
                component='textarea'
                config={{
                    title: 'Mô tả',
                    rules: {
                        require: true,
                    },
                }}
                name="description"
            />



            <FieldForm
                component='text'
                config={{
                    title: 'Root domain',
                    rules: {
                        require: true,
                    },
                }}
                name="root_domain"
            />

            <FieldForm
                component='select'
                config={{
                    title: 'Trạng thái',
                    rules: {
                        require: true,
                    },
                    list_option: {
                        private: {
                            title: 'Riêng tư',
                            description: 'Chỉ mình bạn có thể sử dụng',
                        },
                        protected: {
                            title: 'Được bảo vệ',
                            description: 'Chỉ những người được bạn thêm vào mới có thể sử dụng',
                        },
                        public: {
                            title: 'Công khai',
                            description: 'Mọi người đều có thể sử dụng ứng dụng này',
                        },
                    },
                }}
                name="application_status"
            />
        </Box>
    </FormWrapper>
}