import { Box, Breadcrumbs, Typography } from '@mui/material';
import Loading from 'components/atoms/Loading';
import Page from 'components/templates/Page';
import React from 'react';
import codingChallengeService, { ChallengeCompanyProps } from 'services/codingChallengeService';
import ProblemsTable from './ProblemsTable';
import { Link } from 'react-router-dom';

function CompanyDetail({ slug }: { slug: string }) {

  const [compnay, setCompnay] = React.useState<ChallengeCompanyProps | null>(null);

  React.useEffect(() => {
    (async () => {
      const compnayApi = await codingChallengeService.getCompanyDetail(slug);
      setCompnay(compnayApi);
    })();

  }, []);

  return (<Page
    title={compnay ? compnay.title + '' : 'Compnay'}
    description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
    image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
  >
    {
      compnay ?
        <Box
          sx={{
            pt: 15
          }}
        >
          <Breadcrumbs maxItems={5} aria-label="breadcrumb">
            <Link color="inherit" to="/">
              Trang chủ
            </Link>
            <Link color="inherit" to="/exercise">
              Luyện tập
            </Link>
          </Breadcrumbs>
          <Typography sx={{ mt: 1 }} variant='h1'>{compnay.title}</Typography>
          <ProblemsTable
            type='compnay'
            meta={slug}
            disableFilterCompnay
          />
        </Box>
        :
        <Loading open isCover isWarpper />
    }
  </Page>)
}

export default CompanyDetail