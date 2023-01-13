import { Box } from '@mui/system'
import Button from 'components/atoms/Button'
import Icon from 'components/atoms/Icon'
import CourseTest from 'components/pages/CorePage/Course/components/CourseTest/CourseTest'
import React from 'react'

function Tests({ tests: testProps }: {
    tests?: Array<{
        title: string,
        id: ID,
        is_answer: number,
    }>
}) {

    const [tests, setTests] = React.useState<Array<{
        title: string,
        id: ID,
        is_answer: number,
    }> | undefined>(undefined);

    React.useEffect(() => {
        setTests(testProps);
    }, [testProps]);

    const [openTest, setOpenTest] = React.useState<ID | null>(null);

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
            }}
        >
            {
                tests ?
                    tests.map(item => (
                        <Button
                            variant='contained'
                            color={item.is_answer ? 'success' : 'inherit'}
                            startIcon={<Icon icon="CheckCircleRounded" />}
                            key={item.id}
                            onClick={() => {
                                setOpenTest(item.id);
                            }}
                        >
                            {item.title}
                        </Button>
                    ))
                    :
                    <></>
            }

            <CourseTest
                testId={openTest}
                onClose={() => setOpenTest(null)}
                onSubmited={() => {
                    if (openTest) {

                        setTests(prev =>
                            prev ?
                                prev.map(item => (item.id + '') === (openTest + '') ? { ...item, is_answer: 1 }
                                    : item)
                                : prev)

                    }
                }}
            />
        </Box>
    )
}

export default Tests