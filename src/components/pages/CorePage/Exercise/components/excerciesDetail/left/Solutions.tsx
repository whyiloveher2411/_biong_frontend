import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Box, Button, IconButton, Skeleton, Tooltip, Typography } from "@mui/material";
import Divider from "components/atoms/Divider";
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from "components/atoms/ImageLazyLoading";
import ContentHtml from "components/molecules/AddinData/ContentHtml";
import NotFound from 'components/molecules/NotFound';
import { getCookie, setCookie } from 'helpers/cookie';
import { dateTimefromNow } from "helpers/date";
import { getImageUrl } from "helpers/image";
import { nFormatter } from 'helpers/number';
import { useStatedApi } from 'hook/useApi';
import useReaction from 'hook/useReaction';
import Comments from 'plugins/Vn4Comment/Comments';
import React from "react";
import { Link } from 'react-router-dom';
import codingChallengeService from 'services/codingChallengeService';
import { useUser } from "store/user/user.reducers";
import { useCodingChallengeContext } from "../context/CodingChallengeContext";
import useQuery from 'hook/useQuery';
import { delayUntil } from 'helpers/script';
import { ISubmissionsPostProps } from '../../ExerciseDetail';

function Solutions() {

    const codingChallengeContext = useCodingChallengeContext();

    const [solutionDetail, setSolutionDetail] = React.useState<ISubmissionsPostProps | null>(null);

    const useParamUrl = useQuery({
        solution_detail: '',
    });

    const user = useUser();

    React.useEffect(() => {
        if (codingChallengeContext.solutions === null) {
            codingChallengeContext.updateListingSolutions();
        }
    }, [codingChallengeContext.submissionsPost, user]);

    React.useEffect(() => {
        delayUntil(() => codingChallengeContext.solutions !== null ? true : false, () => {
            if (useParamUrl.query.solution_detail && codingChallengeContext.solutions) {
                const index = codingChallengeContext.solutions.data.findIndex(item => item.id.toString() === useParamUrl.query.solution_detail);
                if (index > -1) {
                    handleOpenSolution(codingChallengeContext.solutions.data[index].id);
                } else {
                    useParamUrl.changeQuery({ solution_detail: '' });
                }
            }
        });
    }, [codingChallengeContext.solutions]);

    const api = useStatedApi();

    const handleOpenSolution = async (id: ID) => {
        useParamUrl.changeQuery({ solution_detail: id });
        api.call('get-solutions-detail', async () => {
            const hasCookie = getCookie('v-solu-' + id);
            const post = await codingChallengeService.getDetailSolution(id, hasCookie ? false : true);
            setSolutionDetail(post);
            setCookie('v-solu-' + id, '1', 1);
        }, (_) => {
            //
        }, 1000);
    }

    if (api.open['get-solutions-detail'] || (useParamUrl.query.solution_detail && !solutionDetail)) {
        return <SolutionDetailSkeleton />
    }

    const handleOnChangeSolutionItem = (solution: ISubmissionsPostProps) => {
        codingChallengeContext.setSolutions(prev => {

            if (prev) {
                const findIndex = prev.data.findIndex(item => item.id.toString() === solution.id.toString());
                if (findIndex > -1) {
                    prev.data[findIndex] = solution;
                }
            }
            return prev;
        })
    }

    if (solutionDetail) {
        return <SolutionDetail
            solutionDetail={solutionDetail}
            setSolutionDetail={setSolutionDetail}
            handleOnChangeSolutionItem={handleOnChangeSolutionItem}
            onCloseSolutionDetail={() => {
                setSolutionDetail(null);
                useParamUrl.changeQuery({ solution_detail: '' });
            }}
        />
    }

    return (<Box
        className={"custom_scroll"}
        sx={{
            position: 'relative',
            zIndex: 2,
            margin: 0,
            maxHeight: '100%',
            overflowY: 'scroll',
        }}
    >
        {
            codingChallengeContext.solutions ?
                codingChallengeContext.solutionPaginate.isLoading ?
                    <SolutionsSkeleton count={codingChallengeContext.solutions.data.length} />
                    :
                    codingChallengeContext.solutions.total ?
                        codingChallengeContext.solutions.data.map((item, index) => <SolutionItem
                            key={item.id}
                            item={item}
                            handleOpenSolution={handleOpenSolution}
                        />
                        )
                        : <Box sx={{ p: 3 }}><NotFound
                            title='Chưa có giải pháp nào được gửi.'
                            subTitle={'Chưa có ai gửi giải pháp cho thử thách này, hãy là người đầu tiên gửi giải pháp cho thử thách này nhé!!'}
                        /></Box>

                :
                <SolutionsSkeleton count={10} />
        }
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: 2,
            }}
        >
            {
                codingChallengeContext.solutionPaginate.component
            }
        </Box>
    </Box>)
}

export default Solutions


function SolutionsSkeleton({ count }: { count: number }) {
    return <>
        {[...Array(count)].map((_, index) => <Box
            key={index}
            sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'dividerDark',
            }}
        >
            <Box>
                <Skeleton variant='circular' sx={{
                    width: 36,
                    height: 36,
                }} />
            </Box>
            <Box>
                <Skeleton variant='text' sx={{ height: 18, width: 200 }} />
                <Skeleton variant='text' sx={{ height: 24, width: 170 }} />
                <Skeleton variant='text' sx={{ height: 18, width: 100 }} />
            </Box>
        </Box>)
        }
    </>
}

function SolutionDetailSkeleton() {
    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        }}
    >
        <Box sx={{
            borderBottom: '1px solid',
            borderColor: 'dividerDark',
            pt: 1,
            pb: 1,
            pl: 1,
        }}>
            <Skeleton>
                <Button
                    size="small"
                    sx={{ textTransform: 'unset', fontSize: 14, }}
                    color='inherit'
                    startIcon={<ArrowBackRoundedIcon />}
                > Quay lại</Button>
            </Skeleton>
        </Box>
        <Box
            className={"custom_scroll"}
            sx={{
                position: 'relative',
                zIndex: 2,
                margin: 0,
                maxHeight: '100%',
                overflowY: 'scroll',
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
            }}>
                <Box>
                    <Skeleton>
                        <Typography variant="h1">Lorem ipsum dolor sit amet, consectetur adipisicing.</Typography>
                    </Skeleton>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            mt: 2,
                        }}
                    >

                        <Skeleton variant='circular' sx={{
                            width: 48,
                            height: 48,
                        }} />
                        <Box>
                            <Skeleton>
                                <Typography variant="h5" >Dang Thuyen Quan</Typography>
                            </Skeleton>
                            <Skeleton>
                                <Typography variant='body2'>9 gioi trước</Typography>
                            </Skeleton>
                        </Box>
                    </Box>
                </Box>
                <Divider />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Divider />
            </Box>
        </Box>
    </Box>
}

function SolutionDetail({ solutionDetail, setSolutionDetail, handleOnChangeSolutionItem, onCloseSolutionDetail }: {
    setSolutionDetail: React.Dispatch<React.SetStateAction<ISubmissionsPostProps | null>>,
    solutionDetail: ISubmissionsPostProps,
    handleOnChangeSolutionItem: (solution: ISubmissionsPostProps) => void,
    onCloseSolutionDetail: () => void
}) {


    const reactionHook = useReaction({
        post: {
            ...solutionDetail,
            type: 'e_learning_challenge_solution'
        },
        reactionPostType: 'e_solution_reaction',
        keyReactionCurrent: 'my_reaction_type',
        reactionTypes: ['vote', 'down_vote'],
        afterReaction: (result) => {
            console.log(result);
            if (result.summary) {
                handleOnChangeSolutionItem({
                    ...solutionDetail,
                    count_down_vote: result.summary.down_vote?.count ?? 0,
                    count_vote: result.summary.vote?.count ?? 0,
                    my_reaction_type: result.my_reaction
                });
            }
        }
    });

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        }}
    >
        <Box sx={{
            borderBottom: '1px solid',
            borderColor: 'dividerDark',
            pt: 1,
            pb: 1,
        }}>
            <Button
                size="small"
                sx={{ textTransform: 'unset', fontSize: 14, }}
                color='inherit'
                startIcon={<ArrowBackRoundedIcon />}
                onClick={onCloseSolutionDetail}
            > Quay lại</Button>
        </Box>
        <Box
            className={"custom_scroll"}
            sx={{
                position: 'relative',
                zIndex: 2,
                margin: 0,
                maxHeight: '100%',
                overflowY: 'scroll',
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
            }}>
                <Box
                    sx={{
                        display: 'flex',
                    }}
                >
                    <Box>
                        <Typography variant="h1">{solutionDetail.title}</Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                mt: 2,
                            }}
                        >
                            {
                                solutionDetail.author ?
                                    <Link to={'/user/' + solutionDetail.author.slug}>
                                        <ImageLazyLoading
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '50%',
                                            }}
                                            src={getImageUrl(solutionDetail.author.avatar, '/images/user-default.svg')}
                                            name={solutionDetail.author.title}
                                        />
                                    </Link>
                                    : null
                            }
                            <Box>
                                {
                                    solutionDetail.author ?
                                        <Link to={'/user/' + solutionDetail.author.slug}>
                                            <Typography variant="h5" >{solutionDetail.author.title}</Typography>
                                        </Link>
                                        : null
                                }
                                <Typography variant='body2'>{dateTimefromNow(solutionDetail.created_at as string)}</Typography>
                            </Box>

                        </Box>


                    </Box>
                    <Box
                        sx={{
                            ml: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Tooltip
                            title="Đây là câu trả lời hữu ich"
                        >
                            <IconButton color={reactionHook.my_reaction === 'vote' ? 'primary' : 'inherit'}
                                onClick={() => {
                                    reactionHook.handleReactionClick(solutionDetail.id, reactionHook.my_reaction === 'vote' ? '' : 'vote')
                                }}
                            >
                                <KeyboardArrowUpRoundedIcon sx={{ fontSize: 36 }} />
                            </IconButton>
                        </Tooltip>
                        <Typography variant='h3'>
                            {(reactionHook.counts.vote ?? 0) - (reactionHook.counts.down_vote ?? 0)}
                        </Typography>
                        <Tooltip
                            title="Đây là câu trả lời không hữu ich"
                        >
                            <IconButton color={reactionHook.my_reaction === 'down_vote' ? 'primary' : 'inherit'}
                                onClick={() => {
                                    reactionHook.handleReactionClick(solutionDetail.id, reactionHook.my_reaction === 'down_vote' ? '' : 'down_vote')
                                }}
                            >
                                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 36 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
                <Divider />

                <ContentHtml content={solutionDetail.content_submit_solution} />

                <Divider />
                <Comments
                    keyComment={solutionDetail.id}
                    type={'e_solution_comment'}
                />
            </Box>
        </Box>
    </Box>

}


function SolutionItem({ item, handleOpenSolution }: {
    item: ISubmissionsPostProps,
    handleOpenSolution: (id: ID) => Promise<void>,
}) {

    return <Box
        key={item.id}
        sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'dividerDark',
        }}
    >
        <Box>
            {
                item.author ?
                    <Link to={'/user/' + item.author.slug}>
                        <ImageLazyLoading
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                            }}
                            src={getImageUrl(item.author.avatar, '/images/user-default.svg')}
                            name={item.author.title}
                        />
                    </Link>
                    : null
            }

        </Box>
        <Box>
            <Typography onClick={() => handleOpenSolution(item.id)} variant="h2" sx={{ fontSize: 14, lineHeight: '18px', fontWeight: 'bold', cursor: 'pointer', }}>{item.title}</Typography>
            {
                item.author ?
                    <Link to={'/user/' + item.author.slug}>
                        <Typography sx={{ fontSize: 12 }}>{item.author.title}</Typography>
                    </Link>
                    : null
            }
            <Typography variant='body2'>{dateTimefromNow(item.created_at as string)}</Typography>
            <Box
                onClick={() => {
                    handleOpenSolution(item.id)
                }}
                sx={{
                    display: 'flex',
                    gap: 2,
                    pt: 1,
                    cursor: 'pointer',
                }}
            >
                <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <Icon sx={{ fontSize: 16, mb: 0.5, mr: 0.5, color: item.my_reaction_type === 'vote' ? 'primary.main' : 'inherit' }} icon={{ custom: '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="up" class="svg-inline--fa fa-up absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 82.4L334.7 232.3c.8 .8 1.3 2 1.3 3.2c0 2.5-2 4.6-4.6 4.6H248c-13.3 0-24 10.7-24 24V432H160V264c0-13.3-10.7-24-24-24H52.6c-2.5 0-4.6-2-4.6-4.6c0-1.2 .5-2.3 1.3-3.2L192 82.4zm192 153c0-13.5-5.2-26.5-14.5-36.3L222.9 45.2C214.8 36.8 203.7 32 192 32s-22.8 4.8-30.9 13.2L14.5 199.2C5.2 208.9 0 221.9 0 235.4c0 29 23.5 52.6 52.6 52.6H112V432c0 26.5 21.5 48 48 48h64c26.5 0 48-21.5 48-48V288h59.4c29 0 52.6-23.5 52.6-52.6z"></path></svg>' }} />
                    <Typography variant='body2'>{nFormatter((item.count_vote ?? 0) - (item.count_down_vote ?? 0))}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                    <RemoveRedEyeOutlinedIcon sx={{ mr: 0.5 }} />
                    <Typography variant='body2'>{nFormatter(item.view)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                    <Icon sx={{ fontSize: 16, mb: 0.5, mr: 0.5 }} icon={{ custom: '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="comment" class="svg-inline--fa fa-comment absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"></path></svg>' }} />
                    <Typography variant='body2'>{nFormatter(item.comment_count)}</Typography>
                </Box>

            </Box>
        </Box>
    </Box>
}