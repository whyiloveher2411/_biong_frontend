import { Box } from '@mui/material';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
// import CareerPaths from './CareerPaths';

const GameHub = () => {

    return (
        <Page
            title={__('Game hub')}
            description='Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                }}
            >

            </Box>
        </Page>
    );
};

export default GameHub;
