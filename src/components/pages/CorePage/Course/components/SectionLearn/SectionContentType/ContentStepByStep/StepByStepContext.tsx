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
    handleEventClickButton: "check" | "checkagain" | null,
    setDisableButtonCheck: React.Dispatch<React.SetStateAction<boolean>>,
}