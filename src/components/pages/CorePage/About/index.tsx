import { Box } from '@mui/material';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import BannerImage from './components/BannerImage';
import BannerText from './components/BannerText';

function About() {

    return (
        <Page
            title={__('About')}
            sx={{
                m: -4,
                mb: -9,
                pt: 4,
                pl: 4,
                pr: 4,
                pb: 0,
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
                    Sứ mệnh của chúng tôi là làm cho <Box component="span" display="inline" sx={{ color: 'rgb(66, 133, 244)' }}>việc học</Box> trở nên <Box component="span" display="inline" sx={{ color: 'rgb(234, 67, 53)' }}>dễ dàng</Box> hơn và làm cho <Box component="span" display="inline" sx={{ color: 'rgb(249, 171, 0)' }}>kiến thức</Box> đó thật sự <Box component="span" display="inline" sx={{ color: 'rgb(52, 168, 83)' }}>hữu ích</Box> và <Box component="span" display="inline" sx={{ color: 'rgb(216, 18, 139)' }}>dễ tiếp cận với tất cả mọi người</Box>
                </Box>
            </BannerText>

            <BannerImage
                subTitle='Tầm nhìn'
                title='"Tầm nhìn của chúng tôi là tạo ra một cuộc sống tốt hơn cho nhiều người." Đó là khát vọng, và hướng đi của chúng tôi. Hơn thế nữa, nó còn là lời hứa của chúng tôi với bạn.'
                image='https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'

            />

            <BannerImage
                subTitle='Sứ mệnh'
                title='Sứ mệnh của chúng tôi là giúp mọi người có thể dễ dàng tiếp cận với các kiến thức mới, thực tiễn và mỗi ngày, từ đó giúp mọi người cải thiện cuộc sống của chính mình và mọi người xung quanh.'
                image='https://images.unsplash.com/photo-1459183885421-5cc683b8dbba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
                sx={{
                    marginTop: 12,
                    marginBottom: 12,
                }}
            />

            <BannerImage
                subTitle='Câu chuyện của chúng ta'
                title='Chúng tôi đã khởi đầu từ những đam mê, và bây giờ chúng tôi muốn chia sẽ đam mê đó với bạn. Hãy cũng nhau viết tiếp chương tiếp theo, phần tuyệt vời nhất của câu chuyện đang đợi bạn tiếp tục.'
                image='https://images.unsplash.com/photo-1527176930608-09cb256ab504?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80'
                sx={{
                    marginTop: 12,
                    marginBottom: 12,
                }}
            />
        </Page>
    )
}

export default About