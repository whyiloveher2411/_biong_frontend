import { createContext } from "react";

const StepByStepContext = createContext<IStepByStepContextProps>({
    handleEventClickButton: null,
    setHandleEventClickButton: () => null,
    showButtons: {
        continue: false,
        tryCheckAgain: false,
        checkResult: false,
        hint: false,
        stateCheck: false,
    },
    setShowButtons: () => null,
    setDisableButtonCheck: () => null,
    updateHeartWrongAnswer: async () => {
        return false;
    },
    handleClickNextButton: () => null,
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
    setDisableButtonCheck: React.Dispatch<React.SetStateAction<boolean>>,
    updateHeartWrongAnswer: () => Promise<boolean>,
    handleEventClickButton: 'check' | 'checkagain' | 'hint' | null,
    setHandleEventClickButton: React.Dispatch<React.SetStateAction<"check" | "checkagain" | "hint" | null>>,
    handleClickNextButton: () => void,
}