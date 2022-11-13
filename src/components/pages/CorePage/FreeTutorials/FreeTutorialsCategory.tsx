import { Box, Button, Skeleton, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import Tabs from 'components/atoms/Tabs';
import NoticeContent from 'components/molecules/NoticeContent';
import Page from 'components/templates/Page';
import { dateTimefromNow } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { getUrlParams } from 'helpers/url';
import Comments from 'plugins/Vn4Comment/Comments';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import elearningService from 'services/elearningService';
import { FreeTutorialCategoryProps, FreeTutorialContent, FreeTutorialSection } from 'services/elearningService/@type';
import Advertisement from './Advertisement';

function FreeTutorialsCategory({ slug }: {
    slug: string
}) {

    const postSlug = getUrlParams(window.location.search, {
        tab_ftc: '',
        subtab_ftc: '',
    });

    const [data, setData] = React.useState<{
        category: FreeTutorialCategoryProps,
        sections: FreeTutorialSection[],
    } | null>(null);

    const [activeCommingSoon, setActiveCommingSoon] = React.useState(false);

    const [content, setContent] = React.useState<FreeTutorialContent | null>(null);

    const naviage = useNavigate();

    React.useEffect(() => {

        (async () => {

            const category = elearningService.freeTutorial.getCategory(slug);
            const content = elearningService.freeTutorial.getContent(slug, postSlug.tab_ftc + '', postSlug.subtab_ftc + '');

            Promise.all([category, content]).then(([category, content]) => {
                if (category) {
                    setData(category);
                }

                if (content) {
                    setContent(content);
                } else {
                    if (postSlug.subtab_ftc) {
                        naviage('/free-tutorials');
                    } else {
                        setActiveCommingSoon(true);
                    }
                }
            });

        })()
    }, []);

    React.useEffect(() => {
        if (data) {
            setContent(null);

            (async () => {
                const content = await elearningService.freeTutorial.getContent(slug, postSlug.tab_ftc + '', postSlug.subtab_ftc + '');

                if (content) {
                    setContent(content);
                } else {
                    naviage('/free-tutorials');
                }

            })()

        }
    }, [postSlug.subtab_ftc]);

    const tabs = data ? data.sections.map((item) => ({
        title: item.title,
        key: item.slug,
        content: () => <></>,
        subTab: item.posts?.length ? item.posts?.map((item2) => ({
            title: item2.title,
            key: item2.slug,
            content: () => <FreeTutorialDetail content={content} />
        })) : []
    })) : [];

    return (
        <Page
            title={content ? content.title : 'Hướng dẫn miễn phí'}
        >
            <Box
                sx={{
                    mt: 12
                }}
            >
                <Button sx={{ mb: 3, }} startIcon={<Icon icon="ArrowBackRounded" />} component={Link} to="/free-tutorials" color='inherit' variant='outlined'>{__('Quay lại trang danh mục')}</Button>
                {
                    data ?
                        tabs.length ?
                            <Tabs
                                name='ftc'
                                orientation='vertical'
                                tabIndex={0}
                                activeIndicator={false}
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
                            [...Array(25)].map((_, index) => (
                                <Skeleton key={index} />
                            ))
                }
            </Box>
        </Page>
    );
}

export default FreeTutorialsCategory

function FreeTutorialDetail({ content }: { content: FreeTutorialContent | null }) {
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
                            <Box sx={{ lineHeight: '32px', fontSize: 18, }}>
                                {
                                    (() => {
                                        let arrContent = content.content.split('[Advertisement/]');

                                        return arrContent.map((item, index) => (
                                            <React.Fragment key={content.id + '_' + index}>
                                                <Box dangerouslySetInnerHTML={{ __html: item }} />
                                                {
                                                    Boolean(index !== (arrContent.length - 1)) &&
                                                    <Advertisement postID={content.id} index={index} />
                                                }
                                            </React.Fragment>
                                        ))
                                    })()
                                }
                            </Box>
                            <Typography align='right' sx={{ fontStyle: 'italic' }}>
                                {__('Cập nhật cuối cùng: {{dataTime}}', { dataTime: dateTimefromNow(content.updated_at) })}
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
                content?.id ?
                    <Comments
                        followType='vn4_comment_object_follow'
                        keyComment={"free-tutorials/" + content.id}
                    />
                    :
                    <></>
            }
        </Box>
    </>
}