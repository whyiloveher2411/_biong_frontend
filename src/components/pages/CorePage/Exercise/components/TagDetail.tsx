import { Box, Breadcrumbs, Typography } from '@mui/material';
import Loading from 'components/atoms/Loading';
import Page from 'components/templates/Page';
import React from 'react';
import codingChallengeService, { ChallengeTagProps } from 'services/codingChallengeService';
import ProblemsTable from './ProblemsTable';
import { Link } from 'react-router-dom';

function TagDetail({ slug }: { slug: string }) {

  const [tag, setTag] = React.useState<ChallengeTagProps | null>(null);

  React.useEffect(() => {
    (async () => {
      const tagApi = await codingChallengeService.getTagDetail(slug);
      setTag(tagApi);
    })();

  }, []);

  return (<Page
    title={(tag ? tag.title + ' | ' : '') + 'Luyện tập'}
    description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
    image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
  >
    {
      tag ?
        <Box
          sx={{
            pt: 15
          }}
        >
          <Breadcrumbs maxItems={5} aria-label="breadcrumb">
            <Link color="inherit" to="/exercise">
              Luyện tập
            </Link>
          </Breadcrumbs>
          <Typography sx={{ mt: 1 }} variant='h1'>{tag.title}</Typography>
          <ProblemsTable
            type='tag'
            meta={slug}
            disableFilterTab
          />
        </Box>
        :
        <Loading open isCover isWarpper />
    }
  </Page>)
}

export default TagDetail