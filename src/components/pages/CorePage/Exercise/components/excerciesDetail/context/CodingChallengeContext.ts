import { PaginationProps } from "components/atoms/TablePagination";
import { UseConfirmDialogExportProps } from "hook/useConfirmDialog";
import { UsePaginateProps } from "hook/usePaginate";
import { createContext, useContext } from "react";
import { ChallengeOfficialSolutionProps, CodingChallengeProps, RuntestProps } from "services/codingChallengeService";
import { ICodeChallengeSolutionProps, ISubmissionsPostProps } from "../../ExerciseDetail";

const CodingChallengeContext = createContext<CodingChallengeContextProps>({
} as CodingChallengeContextProps);

export default CodingChallengeContext;

export const useCodingChallengeContext = () => useContext<CodingChallengeContextProps>(CodingChallengeContext);

export interface CodingChallengeContextProps {
    challenge: CodingChallengeProps,
    contentLog: [{
        log: string;
        test: {
            [key: string]: {
                result: boolean | undefined;
                actualResults: string | undefined;
            };
        };
        test_pass: number;
        test_count: number;
        log_count: number;
    }, React.Dispatch<React.SetStateAction<{
        log: string;
        test: {
            [key: string]: {
                result: boolean | undefined;
                actualResults: string | undefined;
            };
        };
        test_pass: number;
        test_count: number;
        log_count: number;
    }>>],
    onChangeCode(html: string, css: string, js: string): void,
    submissionsPost: ISubmissionsPostProps | 'listing' | 'submitting',
    dialogConfirm: UseConfirmDialogExportProps,
    setSubmissionsPost: React.Dispatch<React.SetStateAction<ISubmissionsPostProps | "listing" | 'submitting'>>,

    submissions: PaginationProps<ISubmissionsPostProps> | null,
    setSubmissions: React.Dispatch<React.SetStateAction<PaginationProps<ISubmissionsPostProps> | null>>,
    submissionPaginate: UsePaginateProps,
    updateListingSubmissions: (page?: number) => Promise<void>,

    solutions: PaginationProps<ICodeChallengeSolutionProps> | null,
    setSolutions: React.Dispatch<React.SetStateAction<PaginationProps<ICodeChallengeSolutionProps> | null>>,
    solutionPaginate: UsePaginateProps,
    updateListingSolutions: (page?: number) => Promise<void>,

    officialsolution: ChallengeOfficialSolutionProps | null,
    setOfficialsolution: React.Dispatch<React.SetStateAction<ChallengeOfficialSolutionProps | null>>,

    onChangeTab: (tabName: 'description' | 'editorial' | 'solutions' | 'submissions' | 'discussion' | 'testcase') => void,
    isRunningTest: boolean,

    afterOnLoadMonaco: () => void,


    runer: RuntestProps | null
}