import { Card, CardContent, Skeleton, Typography } from '@mui/material';
import Tabs from 'components/atoms/Tabs';
import NoticeContent from 'components/molecules/NoticeContent';
import Page from 'components/templates/Page';
import { dateTimeFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { getUrlParams } from 'helpers/url';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import elearningService from 'services/elearningService';
import { FreeTutorialCategoryProps, FreeTutorialContent, FreeTutorialSection } from 'services/elearningService/@type';

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
            title={__('Free tutorials')}
            isHeaderSticky
            header={
                <>
                    <Link to='/free-tutorials'>
                        <Typography
                            component="h2"
                            gutterBottom
                            variant="overline"
                        >
                            {__("Free tutorials")}
                        </Typography>
                    </Link>
                    <Typography
                        component="h1"
                        gutterBottom
                        variant="h3"
                    >
                        {data ? data.category.title : '...'}
                    </Typography>
                </>
            }
        >
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
        <Card sx={{ mt: 2 }}>
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                }}
            >
                {
                    content ?
                        <>
                            <div dangerouslySetInnerHTML={{ __html: content.content }} />
                            <Typography align='right' sx={{ fontStyle: 'italic' }}>
                                {__('Last update: {{dataTime}}', { dataTime: dateTimeFormat(content.updated_at) })}
                            </Typography>
                        </>
                        :
                        [...Array(20)].map((_, index) => (
                            <Skeleton key={index} />
                        ))
                }
            </CardContent>
        </Card>
    </>
}