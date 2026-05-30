import { Box, IconButton } from '@mui/material';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import AppCourseCard, { AppCourseCardSkeleton } from 'components/molecules/AppCourseCard';
import { __ } from 'helpers/i18n';
import { useIndexedDB } from 'hook/useApi';
import React from 'react';
import spacedevCatalogService, {
    AppCatalogCategory,
    AppCatalogCourse,
} from 'services/spacedevCatalogService';
import { UserState, useUser } from 'store/user/user.reducers';

type AppCourseCatalogProps = {
    appStoreUrl: string;
};

const sliderTrackSx = {
    display: 'flex',
    gap: 2,
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
    pb: 1.5,
    mx: { xs: -2, md: -3 },
    px: { xs: 2, md: 3 },
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255,255,255,0.25) transparent',
    '&::-webkit-scrollbar': {
        height: 6,
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: 3,
        bgcolor: 'rgba(255,255,255,0.2)',
    },
} as const;

function flattenCatalogCourses(categories: AppCatalogCategory[]): AppCatalogCourse[] {
    const seen = new Set<string>();
    const courses: AppCatalogCourse[] = [];

    for (const category of categories) {
        for (const course of category.courses) {
            if (seen.has(course.id)) {
                continue;
            }
            seen.add(course.id);
            courses.push(course);
        }
    }

    return courses;
}

function AppCourseCatalog({ appStoreUrl }: AppCourseCatalogProps) {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(false);

    const { data: categories, setData: setCategories } = useIndexedDB<AppCatalogCategory[] | null>({
        key: 'Homepage/AppCourseCatalog',
        defaultValue: null,
    });

    const user = useUser();

    React.useEffect(() => {
        if (user._state !== UserState.unknown) {
            (async () => {
                setCategories(await spacedevCatalogService.getAppCatalog());
            })();
        }
    }, [user, setCategories]);

    const courses = React.useMemo(
        () => (categories ? flattenCatalogCourses(categories) : []),
        [categories],
    );

    const updateScrollState = React.useCallback(() => {
        const el = trackRef.current;
        if (!el) {
            return;
        }
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollLeft(scrollLeft > 4);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }, []);

    React.useEffect(() => {
        const el = trackRef.current;
        if (!el || categories === null) {
            return undefined;
        }
        updateScrollState();
        el.addEventListener('scroll', updateScrollState, { passive: true });
        window.addEventListener('resize', updateScrollState);
        return () => {
            el.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [categories, courses.length, updateScrollState]);

    const scrollByPage = (direction: 'left' | 'right') => {
        const el = trackRef.current;
        if (!el) {
            return;
        }
        const amount = Math.max(el.clientWidth * 0.85, 280);
        el.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });
    };

    if (categories !== null && courses.length === 0) {
        return null;
    }

    return (
        <Box
            component="section"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: 8,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 1.5,
                }}
            >
                <Typography sx={{ fontWeight: 400 }} variant="h3" component="h2">
                    {__('Khóa học chỉ có trên điện thoại')}
                </Typography>
                {categories !== null && (
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5, flexShrink: 0 }}>
                        <IconButton
                            size="small"
                            aria-label={__('Cuộn trái')}
                            disabled={!canScrollLeft}
                            onClick={() => scrollByPage('left')}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.06)',
                                border: '1px solid',
                                borderColor: 'rgba(255,255,255,0.1)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                                '&.Mui-disabled': { opacity: 0.35 },
                            }}
                        >
                            <Icon icon="ArrowBackRounded" fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            aria-label={__('Cuộn phải')}
                            disabled={!canScrollRight}
                            onClick={() => scrollByPage('right')}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.06)',
                                border: '1px solid',
                                borderColor: 'rgba(255,255,255,0.1)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                                '&.Mui-disabled': { opacity: 0.35 },
                            }}
                        >
                            <Icon icon="ArrowForwardRounded" fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </Box>

            {categories === null ? (
                <Box sx={sliderTrackSx}>
                    {[1, 2, 3, 4, 5].map((item) => (
                        <AppCourseCardSkeleton key={item} compact />
                    ))}
                </Box>
            ) : (
                <Box
                    ref={trackRef}
                    sx={sliderTrackSx}
                    role="region"
                    aria-label={__('Danh sách khóa học')}
                >
                    {courses.map((course) => (
                        <AppCourseCard
                            key={course.id}
                            course={course}
                            appStoreUrl={appStoreUrl}
                            compact
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default AppCourseCatalog;
