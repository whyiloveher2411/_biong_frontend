import { Author, CourseLessonProps } from "services/courseService"

export interface QuestionAndAnswerProps {
    id: ID,
    title: string,
    content: string,
    vote_count: string,
    comment_count: string,
    author?: Author,
    created_at: string,
    lesson: CourseLessonProps,
    my_follow: string,
    is_incognito: number,
}

export interface PageContentProps {
    id: ID,
    slug: string,
    title: string,
    content?: string,
    updated_at: string,
}

export interface FreeTutorialCategoryProps {
    title: string,
    featured_image: string,
    slug: string,
}

export interface FreeTutorialSection {
    title: string,
    slug: string,
    posts?: Array<{
        title: string,
        slug: string,
        id: ID,
    }>
}

export interface FreeTutorialContent {
    title: string,
    slug: string,
    content: string,
    updated_at: string,
}

export interface UserCV {
    id: ID,
    personal_info: PersonalInfoProps,
    about: string | null,
    projects: Array<ProjectProp> | null,
    work_experience: Array<ExperienceProps> | null,
    education: Array<EducationProps> | null,
    certifications: Array<CertificationProps> | null,
    references: Array<ReferenceProps> | null,
    skills: Array<SkillProps> | null,
}

export interface PersonalInfoProps {
    birthday: string,
    address: string,
    phone_number: string,
    email: string,
    languages: string,
    social: Array<{
        link: string,
        type: string,
    }>
}

export interface SkillProps {
    id: ID | null,
    title: string,
}

export interface ReferenceProps {
    id: ID | null,
    full_name: string,
    role: string,
    company_name: string,
    email: string,
}

export interface ExperienceProps {
    company_name: string,
    title: string,
    employment_type: string,
    location: string,
    start_date: string,
    end_date: string,
    industry: string,
    description: string,
}

export interface EducationProps {
    school: string,
    degree: string,
    field_of_study: string,
    start_date: string,
    end_date: string,
    grade: string,
    activities_and_societies: string,
    description: string,
}

export interface CertificationProps {
    certificate: string,
    organization: string,
    time: string,
    website: string,
}

export interface ProjectProp {
    id: ID,
    title: string,
    description: string,
    featured_image: string,
    role: string,
    website?: string,
    is_public: number,
}
