import { Box, Skeleton, Typography } from '@mui/material';
import Tabs from 'components/atoms/Tabs';
import NoticeContent from 'components/molecules/NoticeContent';
import Page from 'components/templates/Page';
import { dateTimeFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import elearningService from 'services/elearningService';
import { PageContentProps } from 'services/elearningService/@type';

const groupSlug = 'legal';

function index() {

    const [pages, setPages] = React.useState<PageContentProps[] | null>(null);

    const [content, setContent] = React.useState<PageContentProps | null>(null);

    const [activeCommingSoon, setActiveCommingSoon] = React.useState(false);

    const navigate = useNavigate();

    const { tab } = useParams();

    React.useEffect(() => {

        (async () => {

            const pages = elearningService.page.getPagesOfGroup(groupSlug);
            const content = elearningService.page.getContent(groupSlug, (tab ?? '') + '');

            Promise.all([pages, content]).then(([pages, content]) => {
                if (pages) {
                    setPages(pages);
                }

                if (content) {
                    setContent(content);
                } else {
                    if (tab) {
                        navigate('/terms');
                    } else {
                        setActiveCommingSoon(true);
                    }
                }
            });

        })()
    }, []);


    React.useEffect(() => {
        if (pages) {
            setContent(null);

            (async () => {
                const content = await elearningService.page.getContent(groupSlug, (tab ?? '') + '');

                if (content) {
                    setContent(content);
                } else {
                    navigate('/terms');
                }

            })()

        }
    }, [tab]);

    const handleOnChangeTab = (index: number,) => {
        navigate('/terms/' + tabs[index].key);
    };

    const tabs = pages ? pages.map((item) => ({
        title: item.title,
        key: item.slug,
        content: () => <TermsDetail content={content} />
    })) : [];

    const tabIndex = tabs.findIndex(item => item.key === tab) ?? 0;

    return (
        <Page
            title={content ? content.title : '...'}
        >
            <Box
                sx={{
                    mt: 12
                }}
            >
                {
                    pages ?
                        tabs.length ?
                            <Tabs
                                name='pageg'
                                orientation='vertical'
                                tabIndex={tabIndex}
                                activeIndicator={false}
                                onChangeTab={handleOnChangeTab}
                                tabs={tabs}
                                sx={{
                                    '.tabItems .MuiButton-root': {
                                        textTransform: 'none',
                                    }
                                }}
                            />
                            :
                            <NoticeContent
                                title={__('Something awesome is coming!')}
                                description={__('We are working very hard on the new version of our site. It will bring a lot of new features. Stay tuned!')}
                                image="/images/undraw_work_chat_erdt.svg"
                                disableButtonHome
                            />
                        :
                        activeCommingSoon ?
                            <NoticeContent
                                title={__('Something awesome is coming!')}
                                description={__('We are working very hard on the new version of our site. It will bring a lot of new features. Stay tuned!')}
                                image="/images/undraw_work_chat_erdt.svg"
                                disableButtonHome
                            />
                            :
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 4,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 250,
                                        flexShrink: 1,
                                    }}
                                >
                                    {
                                        [...Array(25)].map((_, index) => (
                                            <Skeleton key={index} />
                                        ))
                                    }
                                </Box>
                                <Box
                                    sx={{
                                        width: '100%'
                                    }}
                                >
                                    {
                                        [...Array(25)].map((_, index) => (
                                            <Skeleton key={index} />
                                        ))
                                    }
                                </Box>
                            </Box>

                }
            </Box>
        </Page>
    )
}

export default index

function TermsDetail({ content }: { content: PageContentProps | null }) {
    return <>
        {
            content ?
                <Typography variant='h2'>
                    {content?.title}
                </Typography>
                :
                <Skeleton sx={{ width: '100%', height: 32 }} />
        }
        <Box
            sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
            }}>
            {
                content ?
                    content.content ?
                        <>
                            <Box
                                sx={{
                                    lineHeight: '32px',
                                    fontSize: 18,
                                    textAlign: 'justify',
                                }}
                                dangerouslySetInnerHTML={{ __html: content.content }}
                            />
                            <Typography align='right' sx={{ fontStyle: 'italic' }}>
                                {__('Cập nhật lần cuối: {{dataTime}}', { dataTime: dateTimeFormat(content.updated_at) })}
                            </Typography>
                        </>
                        :
                        <NoticeContent
                            title={__('Những điều tuyệt vời đang đến!')}
                            description={__('Chúng tôi đang làm việc rất chăm chỉ trên phiên bản mới của trang web. Nó sẽ mang lại rất nhiều tính năng mới tuyệt vời. Chúng tôi sẽ ở đây và đợi bạn quay lại!')}
                            image="/images/undraw_work_chat_erdt.svg"
                            disableButtonHome
                        />
                    :
                    [...Array(20)].map((_, index) => (
                        <Skeleton key={index} />
                    ))
            }
            {
                // content?.id ?
                //     <Comments
                //         followType='vn4_comment_object_follow'
                //         keyComment={"terms/" + content.id}
                //     />
                //     :
                //     <></>
            }
        </Box>
    </>
}