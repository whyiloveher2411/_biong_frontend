import { createContext } from "react";

const StepByStepContext = createContext<IStepByStepContextProps>({
    handleEventClickButton: null,
    showButtons: {
        continue: false,
        tryCheckAgain: false,
        checkResult: false,
        hint: false,
        stateCheck: false,
    },
    setShowButtons: () => {
        //
    },
    setDisableButtonCheck: () => {
        //
    },
    updateHeartWrongAnswer: async () => {
        return false;
    }
});

export default StepByStepContext;


export interface IStepByStepContextProps {
    showButtons: {
        continue: boolean;
        tryCheckAgain: boolean;
        checkResult: boolean;
        hint: boolean;
        stateCheck: boolean;
    },
    setShowButtons: React.Dispatch<React.SetStateAction<{
        continue: boolean;
        tryCheckAgain: boolean;
        checkResult: boolean;
        hint: boolean;
        stateCheck: boolean,
    }>>,
    handleEventClickButton: 'check' | 'checkagain' | 'hint' | null,
    setDisableButtonCheck: React.Dispatch<React.SetStateAction<boolean>>,
    updateHeartWrongAnswer: () => Promise<boolean>
}