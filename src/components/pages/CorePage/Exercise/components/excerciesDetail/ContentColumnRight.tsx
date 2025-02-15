import SplitResize from 'components/atoms/SplitResize'
import TestContent from './right/TestContent'
import Coding from './right/Coding'

export default function ContentColumnRight() {
    return (<SplitResize
        storeId='fcc_2_2'
        variant='horizontal'
        sx={{
            '.reiszeBar':{
                backgroundColor: 'transparent',
            }
        }}
        onChange={(value) => {
            // 
        }}
        pane1={<Coding />}
        pane2={<TestContent />}
    />)
}