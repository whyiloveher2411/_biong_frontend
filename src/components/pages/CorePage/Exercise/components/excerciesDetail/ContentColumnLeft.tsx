import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import { Box } from '@mui/material'
import Tabs from 'components/atoms/Tabs'
import Description from './left/Description'
import Discussion from './left/Discussion'
import Editorial from './left/Editorial'
import Solutions from './left/Solutions'
import Submissions from './left/Submissions'

function ContentColumnLeft() {

    // const [dataReviewCourse, setDataReviewCourse] = React.useState<{
    //     open: boolean,
    //     rating: number,
    //     detail: string,
    //     isReviewed: boolean,
    // }>({
    //     open: false,
    //     rating: 5,
    //     detail: '',
    //     isReviewed: false,
    // });


    return (<Box
        sx={{
            pl: 1,
            '.tabsBox ': {
                backgroundColor: 'var(--bgContent)',
                borderRadius: 2,
                overflow: 'hidden',
            },
            '& .tabWarper': {
                paddingLeft: 1,
                paddingRight: 1,
                backgroundColor: 'var(--bgTabTitle)',
            },
            '& .tabItem': {
                fontSize: 14,
            },
            '& .tabContent': {
                maxHeight: '100%',
                height: 'calc( 100vh - 112px - 8px)',
                marginTop: 0,
            }
        }}
    >
        <Tabs
            name='content'
            tabs={[
                {
                    title: <><DescriptionOutlinedIcon />Mô tả</>,
                    content: () => <Description />,
                    key: 'description'
                },
                {
                    title: <><WbSunnyOutlinedIcon />Hướng dẫn</>,
                    content: () => <Editorial />,
                    key: 'editorial'
                },
                {
                    title: <><ScienceOutlinedIcon />Giải pháp</>,
                    content: () => <Solutions />,
                    key: 'solutions'
                },
                {
                    title: <><HistoryRoundedIcon />Bài Đã Nộp</>,
                    content: () => <Submissions />,
                    key: 'submissions'
                },
                {
                    title: <><SmsOutlinedIcon />Thảo luận</>,
                    content: () => <Discussion />,
                    key: 'discussion'
                },
            ]}
        />


    </Box>)
}

export default ContentColumnLeft