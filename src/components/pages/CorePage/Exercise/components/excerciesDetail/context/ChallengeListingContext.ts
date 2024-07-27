import { createContext, useContext } from "react";
import { CodingChallengeSessionProps } from "services/codingChallengeService";

const ChallengeListingContext = createContext<ChallengeListingContextProps>({
} as ChallengeListingContextProps);

export default ChallengeListingContext;

export const useChallengeListingContext = () => useContext<ChallengeListingContextProps>(ChallengeListingContext);

export interface ChallengeListingContextProps {
    solutions: CodingChallengeSessionProps | null,
    setSolutions: React.Dispatch<React.SetStateAction<CodingChallengeSessionProps | null>>,
}