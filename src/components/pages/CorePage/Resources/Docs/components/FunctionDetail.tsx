import { Box, Typography } from '@mui/material';
// import CodeBlock from 'components/atoms/CodeBlock';
import Tabs from 'components/atoms/Tabs';
import Page from 'components/templates/Page';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import docsService, { DocsFunction } from 'services/docsService';
import CourseRelated from './CourseRelated';
import { useDocsFunctions } from './TopicDetail';

function FunctionDetail({ slug, slugTopic, slugSubtopic }: { slugTopic: string, slugSubtopic: string, slug: string }) {

    const [functionDetail, setFunctionDetail] = React.useState<DocsFunction | null>(null);

    const { data: functions } = useDocsFunctions(slugTopic, slugSubtopic);


    React.useEffect(() => {

        (async () => {
            const functionData = await docsService.getFunction(slugTopic, slugSubtopic, slug);
            setFunctionDetail(functionData);
        })();

    }, [slug, slugTopic, slugSubtopic]);

    const tabs = functions ? functions.map((item) => ({
        title: item.title,
        key: item.slug,
        content: () => <ContentFunctionDetail functionDetail={functionDetail} />
    })) : [];

    const tabIndex = tabs.findIndex(item => item.key === slug) ?? 0;
    const navigate = useNavigate();

    const handleOnChangeTab = (index: number,) => {
        navigate('/resources/docs/' + slugTopic + '/' + slugSubtopic + '/' + tabs[index].key);
    };

    return (
        <Page
            title={functionDetail?.title ? functionDetail.title + ' - Docs' : 'Docs'}
            description={functionDetail?.description || ''}
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <Box
                sx={{
                    mt: 12
                }}
            >
                <Tabs
                    name='topics'
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
            </Box>
        </Page>
    )
}

export default FunctionDetail



function ContentFunctionDetail({ functionDetail }: { functionDetail?: DocsFunction | null }) {

    return <Box>
        {/* <BreadcrumbsDocs func={functionDetail} /> */}
        <Typography variant='h1' fontWeight='bold' sx={{ mt: 2 }}>{functionDetail?.title}</Typography>
        {/* <CodeBlock
            html={functionDetail?.content ?? ''}
        /> */}
        {
            functionDetail?.topic?.slug ?
                <CourseRelated slugTopic={functionDetail?.topic?.slug} />
                : null
        }
    </Box>

}
