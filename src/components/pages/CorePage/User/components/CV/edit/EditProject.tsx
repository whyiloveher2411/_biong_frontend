import { Box, Button, Card, CardContent, Chip, Skeleton, Typography } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import { useFormWrapper } from 'components/atoms/fields/FormWrapper';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import LoadingButton from 'components/atoms/LoadingButton';
import TablePagination, { PaginationProps } from 'components/atoms/TablePagination';
import Dialog from 'components/molecules/Dialog';
import NoticeContent from 'components/molecules/NoticeContent';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import { getParamsFromUrl, getUrlParams, replaceUrlParam } from 'helpers/url';
import useConfirmDialog from 'hook/useConfirmDialog';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import elearningService from 'services/elearningService';
import { ProjectProp } from 'services/elearningService/@type';


function EditProject({ onBack, onReloadCV }: { onBack: () => void, onReloadCV: () => Promise<void> }) {

    const [projects, setProjects] = React.useState<PaginationProps<ProjectProp> | null>(null);

    const [isEdited, setIsEdited] = React.useState(false);

    const [editProjectCurrent, setEditProjectCurrent] = React.useState<EditProjectProp | null>(null);

    const confirmDelete = useConfirmDialog();

    const [isLoadingEditProjectButton, setIsLoadingEditProjectButton] = React.useState(false);

    const paginate = getUrlParams(window.location.search, {
        current_page: 0,
        per_page: 5
    });

    const [paginateConfig, setPaginateConfig] = React.useState<{
        current_page: number,
        per_page: number,
    }>({
        current_page: paginate.current_page as number,
        per_page: paginate.per_page as number
    });

    const navigate = useNavigate();

    const formWarpper = useFormWrapper({
        onFinish: (post) => {
            handleEditProject(false, (post as EditProjectProp));
        }
    })

    React.useLayoutEffect(() => {

        (async () => {
            const project = await elearningService.getMyProjects(paginateConfig);
            setProjects(project);
        })();

        navigate('?' + getParamsFromUrl(replaceUrlParam(window.location.href, paginateConfig)));

    }, [paginateConfig]);

    const handleEditProject = (isDelete = false, post: EditProjectProp | null = null) => {

        setIsLoadingEditProjectButton(true);
        setEditProjectCurrent(prev => {

            if (prev) {
                (async () => {
                    const result = await elearningService.editMyProject(post ?? prev, isDelete);
                    if (result) {
                        const project = await elearningService.getMyProjects(paginateConfig);
                        setProjects(project);
                        setEditProjectCurrent(null);
                        setIsLoadingEditProjectButton(false);
                        setIsEdited(true);
                    }
                })();
            }

            return prev;
        });

    };

    React.useEffect(() => {

        if (editProjectCurrent) {
            formWarpper.setPost(editProjectCurrent);
        } else {
            formWarpper.setPost({});
        }

    }, [editProjectCurrent]);

    return (
        <>
            {
                projects ?
                    projects.total > 0 ?
                        <Card>
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                    }}
                                >
                                    <Box>
                                        <Button
                                            color='inherit'
                                            startIcon={<Icon icon="ArrowBackRounded" />}
                                            onClick={() => {
                                                if (isEdited) {
                                                    onReloadCV();
                                                }
                                                onBack();
                                            }}
                                        >
                                            {__('Edit Project')}
                                        </Button>
                                    </Box>
                                    <Button
                                        variant='contained'
                                        startIcon={<Icon icon="AddRounded" />}
                                        onClick={() => setEditProjectCurrent({
                                            description: '',
                                            featured_image: '',
                                            id: 0,
                                            role: '',
                                            title: '',
                                            website: '',
                                            is_public: 0,
                                            action: 'ADD_NEW',
                                        })}
                                    >
                                        {__('Add new')}
                                    </Button>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 3,
                                    }}
                                >
                                    {
                                        projects.data.map((project, index) => (
                                            <ProjectItem
                                                project={project}
                                                key={index}
                                                handleEditProject={() => setEditProjectCurrent({ ...project, action: 'EDIT' })}
                                            />
                                        ))
                                    }
                                </Box>
                                <TablePagination
                                    rowsPerPageOptions={[3, 6, 12, 18, 24, 30]}
                                    count={projects.total}
                                    rowsPerPage={Number(paginateConfig.per_page)}
                                    page={paginateConfig.current_page ? paginateConfig.current_page - 1 : 0}
                                    onPageChange={(_event, page) => {
                                        setPaginateConfig(prev => ({
                                            ...prev,
                                            current_page: page + 1
                                        }));
                                    }}
                                    onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        setPaginateConfig((prev) => ({
                                            current_page: parseInt(event.target.value) * (prev.current_page - 1) < projects.total ? prev.current_page : 1,
                                            per_page: parseInt(event.target.value)
                                        }));
                                    }}
                                />
                            </CardContent>
                        </Card>
                        :
                        <NoticeContent
                            title='Dự án'
                            description={__('Tổng hợp các dự án cho các khách hàng mà bạn đã tham gia')}
                            image="/images/empty_cart.svg"
                            disableButtonHome
                        />
                    :
                    <Card>
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                }}
                            >
                                <Box>
                                    <Skeleton variant='rectangular'>
                                        <Button
                                            color='inherit'
                                            startIcon={<Icon icon="ArrowBackRounded" />}
                                        >
                                            {__('Edit Project')}
                                        </Button>
                                    </Skeleton>
                                </Box>
                                <Skeleton variant='rectangular' sx={{ width: '100%', maxWidth: 'unset' }}>
                                    <Button
                                        variant='contained'
                                        sx={{ width: '100%' }}
                                    >
                                        {__('Add new')}
                                    </Button>
                                </Skeleton>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                }}
                            >
                                {
                                    [1, 2, 3, 4, 5].map((item) => (
                                        <ProjectItemLoading
                                            key={item}
                                        />
                                    ))
                                }
                            </Box>
                        </CardContent>
                    </Card>
            }
            <Dialog
                title={editProjectCurrent && editProjectCurrent.action === 'EDIT' ? __('Edit Project') : __('Add Project')}
                disableEscapeKeyDown
                open={Boolean(editProjectCurrent)}

                onClose={() => {
                    setEditProjectCurrent(null);
                }}
                action={<>
                    {
                        Boolean(editProjectCurrent && editProjectCurrent.action === 'EDIT') &&
                        <LoadingButton
                            loading={isLoadingEditProjectButton}
                            loadingPosition='center'
                            sx={{ mr: 'auto' }}
                            onClick={() => {
                                confirmDelete.onConfirm(() => {
                                    handleEditProject(true)
                                })
                            }}
                            color="error"
                        >
                            {__('Delete')}
                        </LoadingButton>
                    }
                    <Button onClick={() => {
                        setEditProjectCurrent(null);
                    }}
                        color="inherit"
                    >
                        {__('Cancel')}
                    </Button>
                    <LoadingButton
                        loading={isLoadingEditProjectButton}
                        loadingPosition='center'
                        variant='contained'
                        onClick={() => {
                            // handleEditProject()
                            formWarpper.onSubmit();
                        }}
                    >
                        {__('Save Changes')}
                    </LoadingButton>
                </>}
            >
                {
                    formWarpper.renderFormWrapper(<Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                        <FieldForm
                            component='text'
                            config={{
                                title: __('Title'),
                                rules: {
                                    require: true,
                                }
                            }}
                            // post={editProjectCurrent ? editProjectCurrent : {}}
                            name="title"
                        // onReview={(value) => {
                        //     setEditProjectCurrent(prev => prev ? { ...prev, title: value } : null);
                        // }}
                        />
                        <FieldForm
                            component='textarea'
                            config={{
                                title: __('Description'),
                                rules: {
                                    require: true,
                                }
                            }}
                            // post={editProjectCurrent ? editProjectCurrent : {}}
                            name="description"
                        // onReview={(value) => {
                        //     setEditProjectCurrent(prev => prev ? { ...prev, description: value } : null);
                        // }}
                        />
                        <FieldForm
                            component='text'
                            config={{
                                title: __('Role'),
                                rules: {
                                    require: true,
                                }
                            }}
                            // post={editProjectCurrent ? editProjectCurrent : {}}
                            name="role"
                        // onReview={(value) => {
                        //     setEditProjectCurrent(prev => prev ? { ...prev, role: value } : null);
                        // }}
                        />
                        <FieldForm
                            component='text'
                            config={{
                                title: __('Website'),
                            }}
                            // post={editProjectCurrent ? editProjectCurrent : {}}
                            name="website"
                        // onReview={(value) => {
                        //     setEditProjectCurrent(prev => prev ? { ...prev, website: value } : null);
                        // }}
                        />

                        <FieldForm
                            component='image'
                            config={{
                                title: __('Featured Image'),
                            }}
                            // post={editProjectCurrent ? editProjectCurrent : {}}
                            name="featured_image"
                        // onReview={(value) => {
                        //     setEditProjectCurrent(prev => prev ? { ...prev, featured_image: value } : null);
                        // }}
                        />

                        <FieldForm
                            component='true_false'
                            config={{
                                title: __('Public'),
                                note: __('Others will see it when you publish it on your profile'),
                            }}
                            // post={editProjectCurrent ? editProjectCurrent : {}}
                            name="is_public"
                        // onReview={(value) => {
                        //     setEditProjectCurrent(prev => prev ? { ...prev, is_public: value } : null);
                        // }}
                        />
                    </Box>)
                }
            </Dialog>
            {confirmDelete.component}
        </>
    )
}

export default EditProject

function ProjectItem({ project, handleEditProject }: {
    project: ProjectProp,
    handleEditProject: () => void
}) {

    return <Box
        sx={{
            display: 'flex',
            gap: 4,
        }}
    >
        <ImageLazyLoading src={getImageUrl(project.featured_image)}
            sx={{
                position: 'relative',
                width: '55%',
                cursor: 'pointer',
                height: '100%',
                borderRadius: 2
            }}
            onClick={handleEditProject}
        />
        <Box
            sx={{ flex: 1, display: 'flex', gap: 1, flexDirection: 'column', justifyContent: 'center', }}
        >
            <Typography variant='overline'>{project.role}</Typography>
            <Typography variant='h3' sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {project.title}
                {!project.is_public &&
                    <Chip size='small' sx={{ background: '#8604c4', color: 'white' }} label={__('Private')} />
                }
                <Button
                    size='small'
                    onClick={handleEditProject}
                    variant='outlined'
                >
                    {__('Edit')}
                </Button>
            </Typography>
            <Typography
                sx={{
                    ...cssMaxLine(5),
                    lineHeight: '28px',
                }}
            >{project.description}</Typography>
            {
                Boolean(project.website) &&
                <Typography><strong>{__('Website')}:</strong> {project.website}</Typography>
            }
        </Box>
    </Box >
}


function ProjectItemLoading() {

    return <Box
        sx={{
            display: 'flex',
            gap: 4,
        }}
    >
        <Skeleton variant='rectangular' sx={{
            position: 'relative',
            width: '55%',
            height: 300,
            cursor: 'pointer',
            borderRadius: 2
        }} />
        <Box
            sx={{ flex: 1, display: 'flex', gap: 1, flexDirection: 'column', justifyContent: 'center', }}
        >
            <Skeleton>
                <Typography variant='overline'>Backend developer</Typography>
            </Skeleton>
            <Skeleton>
                <Typography variant='h3'>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                </Typography>
            </Skeleton>
            <Skeleton>
                <Typography
                    sx={{
                        ...cssMaxLine(5),
                        lineHeight: '28px',
                    }}
                >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia sapiente, voluptates pariatur fuga iste expedita aut voluptatibus placeat provident labore sequi tempora ad maxime magni maiores reprehenderit quis quasi harum!</Typography>
            </Skeleton>
            <Skeleton />
        </Box>
    </Box >
}

interface EditProjectProp extends ProjectProp {
    action: 'EDIT' | 'ADD_NEW'
}