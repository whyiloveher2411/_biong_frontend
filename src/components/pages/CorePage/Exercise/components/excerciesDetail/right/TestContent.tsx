import { Box } from '@mui/material'
import Tabs from 'components/atoms/Tabs'
// import Console from './Console'
import Testcase from './Testcase'

function TestContent() {
    return (
        <Box
            sx={{
                pb: 1,
                pr: 1,
                height: '100%',
                overflow: 'hidden',
                '.tabsBox': {
                    backgroundColor: 'var(--bgContent)',
                    borderRadius: 2,
                },
                '& .tab-horizontal': {
                    height: '100%',
                    overflow: 'hidden',
                },
                '& *': {
                    fontSize: '16px',
                    whiteSpace: 'break-spaces',
                },
                '& .tabWarper': {
                    paddingLeft: 1,
                    paddingRight: 1,
                    backgroundColor: 'var(--bgTabTitle)',
                },
                '& .tabContent': {
                    overflowY: 'overlay',
                    height: 'calc( 100% - 48px )',
                    marginTop: 0,
                }
            }}
        >
            <Tabs
                name='test'
                tabs={[
                    // {
                    //     title: 'Console',
                    //     content: () => <Console />,
                    //     key: 'console'
                    // },
                    {
                        title: 'Kiểm thử',
                        content: () => <Testcase />,
                        key: 'testcase'
                    },
                ]}
            />
        </Box>
    )
}

export default TestContent