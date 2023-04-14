import { Box } from '@mui/material'
import React from 'react'
import { QuestionTestProps } from 'services/elearningService'

function InterfaceComparison({ question, options, showAnswerRight, selected, onChange }: {
    question: string,
    options: QuestionTestProps,
    showAnswerRight: boolean,
    selected?: string[],
    onChange: (value: ANY) => void,
}) {

    return (<Box
        sx={{
            width: 'calc(100vw - 48px)',
        }}
    >
        <div>Hoàn thành giao diện sau</div>
    </Box>
    )
}

export default InterfaceComparison