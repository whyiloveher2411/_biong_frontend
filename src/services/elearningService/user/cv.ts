import { CertificationProps, EducationProps, PersonalInfoProps, ReferenceProps, SkillProps } from './../@type';
import { ajax } from 'hook/useApi';
import { ExperienceProps, UserCV } from '../@type';

export default {
    get: async (
        userID: ID
    ): Promise<UserCV | null> => {

        let api = await ajax<{
            cv: UserCV,
        }>({
            url: 'vn4-e-learning/user/get-cv',
            data: {
                user: userID,
            },
        });

        if (api.cv) {
            return api.cv;
        }

        return null;

    },
    updateAbout: async (about: string): Promise<boolean> => {

        let api = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-e-learning/user/update-cv-about',
            data: {
                about: about,
            },
        });

        return api.result ?? false;
    },
    updateExperience: async (experience: Array<ExperienceProps>): Promise<boolean> => {

        let api = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-e-learning/user/update-work-experiencet',
            data: {
                work_experience: experience,
            },
        });

        return api.result ?? false;
    },

    updateEducationAndCertification: async (education: Array<EducationProps>, certifications: Array<CertificationProps>): Promise<boolean> => {

        let api = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-e-learning/user/update-education',
            data: {
                education: education,
                certifications: certifications,
            },
        });

        return api.result ?? false;
    },

    updateReference: async (references: Array<ReferenceProps>): Promise<boolean> => {

        let api = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-e-learning/user/update-cv-reference',
            data: {
                references: references,
            },
        });

        return api.result ?? false;
    },

    updateSkill: async (skills: Array<SkillProps>): Promise<boolean> => {

        let api = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-e-learning/user/update-cv-skill',
            data: {
                skills: skills,
            },
        });

        return api.result ?? false;
    },

    updatePersonalInfo: async (personal_info: PersonalInfoProps): Promise<boolean> => {

        let api = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-e-learning/user/update-cv-personal-info',
            data: {
                personal_info: personal_info,
            },
        });

        return api.result ?? false;
    },

}
