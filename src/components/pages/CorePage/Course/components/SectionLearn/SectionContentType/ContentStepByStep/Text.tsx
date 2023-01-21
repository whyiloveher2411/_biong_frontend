import CodeBlock from 'components/atoms/CodeBlock';
import React, { useContext } from 'react';
import { ContentOfStep } from '../StepByStep';
import StepByStepContext from './StepByStepContext';

function Text({ content }: { content: ContentOfStep }) {
    const stepByStepContext = useContext(StepByStepContext);

    React.useEffect(() => {
        stepByStepContext.setShowButtons(prev => ({
            ...prev,
            checkResult: false,
            continue: true,
            hint: false,
            stateCheck: false,
            tryCheckAgain: false,
        }))
    }, []);

    if (content.content) {
        return <CodeBlock
            sx={{
                '& strong': {
                    fontSize: 30,
                    marginLeft: '3px',
                }
            }}
            html={content.content}
        />
    }
    return null;
}

export default Text