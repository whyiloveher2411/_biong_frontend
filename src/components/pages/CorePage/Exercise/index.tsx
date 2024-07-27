import { useParams } from 'react-router-dom';
import CompanyDetail from './components/CompanyDetail';
import ExerciseDetail from './components/ExerciseDetail';
import ProblemListing from './components/ProblemListing';
import StudyPlan from './components/StudyPlan';
import StudyPlanDetail from './components/StudyPlanDetail';
import TagDetail from './components/TagDetail';
import React from 'react';
import SubscriptionRequired from './components/SubscriptionRequired';

function Excercise() {

    let { tab, subtab1 } = useParams<{
        tab: string,
        subtab1: string,
    }>();

    if (tab) {
        switch (tab) {
            case 'tag':
                if (subtab1) {
                    return <TagDetail slug={subtab1} />
                }
                break;
            case 'company':
                if (subtab1) {
                    return <CompanyDetail slug={subtab1} />
                }
                break;
            case 'study-plan':
                if (subtab1) {
                    return <StudyPlanDetail slug={subtab1} />
                }

                return <StudyPlan />

        }
        return <ExerciseDetail slug={tab} />
    }


    return <ProblemListing />
}

export default Excercise

export function getLinkExcercise(slug: string, type: 'tag' | 'company' | 'studyPlan' | 'challenge' = 'challenge') {

    switch (type) {
        case 'tag':
            return '/exercise/tag/' + slug;
        case 'company':
            return '/exercise/company/' + slug;
        case 'studyPlan':
            return '/exercise/study-plan/' + slug;
        default:
            return '/exercise/' + slug;
    }
}

export function usePremiumContent({ titleType, position }: { titleType: string, position?: 'absolute' | 'inherit' }) {

    const [showSubscriptionRequired, setShowSubscriptionRequired] = React.useState(false);

    return {
        show: showSubscriptionRequired,
        set: setShowSubscriptionRequired,
        component: <SubscriptionRequired titleType={titleType} position={position} />
    }
}