import { Box } from '@mui/material';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import React from 'react';
import elearningService, { TeamMember } from 'services/elearningService';
import BannerImage from './components/BannerImage';
import BannerText from './components/BannerText';
import MeetOurTeam from './components/MeetOurTeam';

function About() {

    const [data, setData] = React.useState<{ member: TeamMember[] | null } | null>(null);

    React.useEffect(() => {

        (async () => {

            const apiData = await elearningService.staticPage.about();

            setData(apiData);
        })()

    }, []);

    return (
        <Page
            title={__('Về chúng tôi')}
            description='Sứ mệnh của chúng tôi là giúp cho việc học trở nên dễ dàng hơn, làm cho kiến thức đó thật sự hữu ích và dễ tiếp cận với tất cả mọi người'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
            sx={{
                mb: -9,
                pt: 4,
            }}
        >

            {/* <Banner
                subTitle='học viện Spacedev.vn'
                title='Kiến thức sẽ tuyệt vời hơn nếu chúng ta vận dụng nó vào cuôc sống'
                description='Sứ mệnh của chúng tôi là làm cho việc học trở nên dễ dàng hơn và làm cho kiến thức đó thật sự hữu ích và dễ tiếp cận với tất cả mọi người'
                color='rgb(197, 199, 252)'
                image='/images/data/about.jpg'
            /> */}
            <BannerText>
                <Box
                    sx={{ maxWidth: 800, margin: '0 auto', mt: 8, mb: 12, textAlign: 'center' }}
                >
                    Sứ mệnh của chúng tôi là giúp cho <Box component="span" display="inline" sx={{ color: 'rgb(66, 133, 244)' }}>việc học</Box> trở nên <Box component="span" display="inline" sx={{ color: 'rgb(234, 67, 53)' }}>dễ dàng</Box> hơn, làm cho <Box component="span" display="inline" sx={{ color: 'rgb(249, 171, 0)' }}>kiến thức</Box> đó thật sự <Box component="span" display="inline" sx={{ color: 'rgb(52, 168, 83)' }}>hữu ích</Box> và <Box component="span" display="inline" sx={{ color: 'rgb(216, 18, 139)' }}>dễ tiếp cận với tất cả mọi người</Box>
                </Box>
            </BannerText>

            <BannerImage
                subTitle='Tầm nhìn'
                title='"Tầm nhìn của chúng tôi là tạo ra một cuộc sống tốt hơn cho nhiều người." Đó là khát vọng, và hướng đi của chúng tôi. Hơn thế nữa, nó còn là lời hứa của chúng tôi với bạn.'
                image='images/tam-nhin.jpg'

            />

            <BannerImage
                subTitle='Sứ mệnh'
                title='Sứ mệnh của chúng tôi là giúp mọi người có thể dễ dàng tiếp cận với các kiến thức mới, thực tiễn và mỗi ngày, từ đó giúp mọi người cải thiện cuộc sống của chính mình và mọi người xung quanh.'
                image='images/su-menh.jpg'
                sx={{
                    marginTop: 12,
                    marginBottom: 12,
                }}
            />

            <BannerImage
                subTitle='Câu chuyện của chúng ta'
                title='Chúng tôi đã khởi đầu từ những đam mê, và bây giờ chúng tôi muốn chia sẽ đam mê đó với bạn. Hãy cùng nhau viết tiếp chương tiếp theo, phần tuyệt vời nhất của câu chuyện đang đợi bạn tiếp tục.'
                image='images/chia-se-cau-chuyen.jpg'
                sx={{
                    marginTop: 12,
                    marginBottom: 12,
                }}
            />

            <MeetOurTeam sx={{ marginBottom: 12 }} member={data?.member} />
        </Page>
    )
}

export default About