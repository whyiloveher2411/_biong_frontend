import { ajax } from 'hook/useApi';

export interface AppCatalogCourseLabel {
    title: string;
    color: string;
    background_color: string;
}

export interface AppCatalogCourse {
    id: string;
    title: string;
    iconUrl: string;
    difficulty: string;
    studentsCount: number;
    estimatedDuration: string;
    labels: AppCatalogCourseLabel[];
    isComingSoon: boolean;
}

export interface AppCatalogCategory {
    id: string;
    name: string;
    color: string;
    courses: AppCatalogCourse[];
}

const spacedevCatalogService = {
    getAppCatalog: async (): Promise<AppCatalogCategory[]> => {
        const lang = 'vi';

        const data = await ajax<{
            categories?: AppCatalogCategory[];
        }>({
            url: 'vn4-e-learning/course/get-app-catalog',
            data: { lang },
        });

        return data.categories ?? [];
    },
};

export default spacedevCatalogService;
