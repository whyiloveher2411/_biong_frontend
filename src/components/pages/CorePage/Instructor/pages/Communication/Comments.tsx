import { Box, Button, Card, CardContent, Typography, useTheme } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Loading from 'components/atoms/Loading';
import { PaginationProps } from 'components/atoms/TablePagination';
import DrawerCustom from 'components/molecules/DrawerCustom';
import NoticeContent from 'components/molecules/NoticeContent';
import { dateTimeFormat } from 'helpers/date';
import { getImageUrl } from 'helpers/image';
import useAjax from 'hook/useApi';
import usePaginate from 'hook/usePaginate';
import CommentsComponent from 'plugins/Vn4Comment/Comments';
import React from 'react';
import { CommentProps } from 'services/commentService';

function Comments({ setTitle }: { setTitle: (title: string) => void }) {

    React.useEffect(() => {
        setTitle('Comments');
    }, []);

    const theme = useTheme();

    const [comments, setComments] = React.useState<PaginationProps<CommentPropsWithObID> | null>(null);

    const [openCommentDetail, setOpenCommentDetail] = React.useState<CommentPropsWithObID | null>(null);

    const [commentType, setCommentType] = React.useState<keyof typeof commentTypes>('e_lesson_comment');

    const useApi = useAjax();

    const paginate = usePaginate({
        name: 'i_s',
        data: { current_page: 0, per_page: 10 },
        enableLoadFirst: false,
        onChange: async (data) => {
            handleOnloadComment({
                ...data,
                type: commentType,
            })
        },
        isChangeUrl: false,
        pagination: comments,
    });

    const handleOnloadComment = (data?: {
        [key: string]: ANY;
        current_page: number;
        per_page: number;
        type: string,
    }) => {
        useApi.ajax({
            url: 'vn4-e-learning/instructor/communication/comments',
            data: data,
            success: (result: { data: PaginationProps<CommentPropsWithObID> }) => {
                setComments(result.data);
            }
        });
    }

    React.useEffect(() => {
        paginate.set(prev => ({
            ...prev,
            current_page: 0,
            loadData: true,
        }));
    }, [commentType]);


    return (<>
        <Typography variant='h2' sx={{
            mb: 4, display: 'flex',
            alignItems: 'center',
            '& .MoreButton-root': {
                display: 'flex',
            }
        }}>
            Tổng quan
        </Typography>
        <Box
            sx={{
                display: 'flex',
                gap: 1,
            }}
        >
            {
                Object.keys(commentTypes).map((key) => (
                    <Button
                        key={key}
                        color={key === commentType ? 'primary' : 'inherit'}
                        sx={{ textTransform: 'unset', fontSize: 16, fontWeight: 400 }}
                        onClick={() => setCommentType(key as keyof typeof commentTypes)}
                    >
                        {commentTypes[key as keyof typeof commentTypes]}
                    </Button>
                ))
            }
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                gap: 2,
                minHeight: 500
            }}
        >
            {
                useApi.open &&
                <Loading open isCover />
            }
            {
                comments ?
                    comments?.data.length ?
                        comments?.data.map((item, index) => (
                            <Card
                                key={index}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        p: 0,
                                        paddingBottom: '0 !important',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            p: 3,
                                        }}
                                    >
                                        <ImageLazyLoading
                                            src={getImageUrl(item.author?.avatar)}
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Box>
                                            <Typography variant='subtitle1' sx={{ whiteSpace: 'nowrap', }}>{item.author?.title}</Typography>
                                            <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', }}>{dateTimeFormat(item.created_at)}</Typography>
                                            <Button
                                                size="small"
                                                sx={{
                                                    ml: 'auto',
                                                    textTransform: 'unset',
                                                    p: 0,
                                                    minWidth: 'unset',
                                                    fontSize: 16
                                                }}
                                                onClick={() => {
                                                    setOpenCommentDetail(item)
                                                }}
                                            >Trả lời</Button>
                                        </Box>
                                    </Box>
                                    <CodeBlock
                                        html={item.content}
                                        sx={{
                                            borderLeft: '1px solid',
                                            borderColor: 'dividerDark',
                                            p: 3,
                                            flex: 1,
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        ))
                        :
                        <NoticeContent
                            image='/images/notfound.svg'
                            title={'Không tìm thấy bình luận ở ' + commentTypes[commentType as keyof typeof commentTypes]}
                            description=''
                            disableButtonHome
                        />
                    : <></>
            }
            {paginate.component}
        </Box>

        <DrawerCustom
            title="Comment"
            open={openCommentDetail !== null}
            onClose={() => {
                setOpenCommentDetail(null);
            }}
            onCloseOutsite
            restDialogContent={{
                sx: (theme) => ({
                    backgroundColor: theme.palette.mode === 'light' ? '#F0F2F5' : theme.palette.body.background
                })
            }}
        >
            {
                openCommentDetail !== null &&
                <CommentsComponent
                    keyComment={openCommentDetail.detail_link ? openCommentDetail.detail_link : openCommentDetail.comment_to_object}
                    type={openCommentDetail.type}
                    backgroundContentComment={theme.palette.mode === 'light' ? 'white' : 'commentItemBackground'}
                />
            }
        </DrawerCustom>
    </>)
}

export default Comments


interface CommentPropsWithObID extends CommentProps {
    type: string,
    comment_to_object: ID,
    detail_link?: string,
}

const commentTypes = {
    e_lesson_comment: 'Bài học',
    e_freecodecamp_comment: 'Bài học Freecodecamp',
    vn4_comment: 'Explore',
    vn4_comment_course_qa: 'Hỏi đáp',
    vn4_comment_order: 'Đơn hàng',
};