import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DoNotDisturbRoundedIcon from '@mui/icons-material/DoNotDisturbRounded';
import HttpsRoundedIcon from '@mui/icons-material/HttpsRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Box, Chip, FormControl, IconButton, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { PaginationProps } from 'components/atoms/TablePagination';
import Tabs, { TabsProps } from 'components/atoms/Tabs';
import NotFound from 'components/molecules/NotFound';
import { nFormatter } from 'helpers/number';
import { levenshteinDistance } from 'helpers/string';
import { useIndexedDB } from 'hook/useApi';
import useDebounce from 'hook/useDebounce';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import codingChallengeService, { ChallengeTagProps, CodingChallengeProps, CompanyProps, StudyPlanProps } from 'services/codingChallengeService';
import { useChallengeSession } from './Session';
import { CompanyItem } from './TrendingCompanies';
import { usePremiumContent } from '..';
import { CloseRounded } from '@mui/icons-material';

const listStatusFilter: { [key: string]: { title: string, icon: ANY } } = {
    todo: { title: 'Chưa giải quyết', icon: <RemoveRoundedIcon fontSize="small" /> },
    attempted: { title: 'Đã thử', icon: <DoNotDisturbRoundedIcon color='warning' fontSize="small" /> },
    solved: { title: 'Đã giải quyết', icon: <CheckRoundedIcon color='success' fontSize="small" /> },
    // paid_only: { title: 'Trả phí', icon: <HttpsRoundedIcon color="warning" fontSize="small" /> },
}

function ProblemsTable({ type, meta, disableFilterTab, disableFilterCompnay = true }: { type: "tag" | "compnay" | "all", meta?: string, disableFilterTab?: boolean, disableFilterCompnay?: boolean }) {

    const [codingChallenge, setCodingChallenge] = React.useState<PaginationProps<CodingChallengeProps> | null>(null);

    const session = useChallengeSession();

    const [searchTitleTag, setSearchTitleTag] = React.useState('');
    const [searchTitleCompany, setSearchTitleCompany] = React.useState('');
    const [searchTitleChallenge, setSearchTitleChallenge] = React.useState('');

    const [showMoreTag, setShowMoreTag] = React.useState(false);

    const debounceSearchTitleCompany = useDebounce(searchTitleCompany, 300);
    const debounceSearchTitleChallenge = useDebounce(searchTitleChallenge, 300);

    const [filterTagData, setFilterTagData] = React.useState({
        open: false,
        expand_tag: false
    });

    const [companies, setCompanies] = React.useState<PaginationProps<CompanyProps> | null>(null)

    // const [studyPlans, setStudyPlans] = React.useState<StudyPlanProps[] | null>(null)

    const { data: tags } = useIndexedDB<Array<ChallengeTagProps>>({
        key: 'e_challenge_tag_all', defaultValue: [], initFc: () => {
            return codingChallengeService.getTagList();
        },
        cacheTime: 1,
    });

    const [filter, setFilter] = React.useState<{
        difficulty: CodingChallengeProps["difficulty"] | null,
        status: string,
        studyPlan: StudyPlanProps | null,
        tags: ChallengeTagProps[],
        companies: CompanyProps[],
        title: string,
    }>({
        difficulty: null,
        status: '',
        studyPlan: null,
        tags: [],
        companies: [],
        title: '',
    });

    const tableRef = React.useRef<HTMLTableElement>(null);

    const premiumContent = usePremiumContent({ titleType: 'công ty', position: 'inherit' });
    const navigate = useNavigate();
    const codingChallengePaginate = usePaginate<CodingChallengeProps>({
        name: 'p_cha',
        template: 'page',
        onChange: async (data) => {

            const searchData: { [key: string]: ANY } = {};

            if (filter.studyPlan) {
                searchData.studyPlan = filter.studyPlan.id;
            }
            searchData.tags = filter.tags.map(item => item.id);
            searchData.difficulty = filter.difficulty;
            searchData.title = searchTitleChallenge;
            searchData.companies = filter.companies.map(item => item.id);
            searchData.status = filter.status;

            const codingChallenge = await codingChallengeService.getChallenges(data.current_page, type, meta, searchData);

            if (codingChallenge === 'subscription_required') {
                premiumContent.set(true);
                return;
            }

            setCodingChallenge(codingChallenge);
            premiumContent.set(false);
            // updateListingSubmissions(data.current_page);
        },
        scrollToELementAfterChange: tableRef,
        // enableLoadFirst: true,
        isChangeUrl: true,
        pagination: codingChallenge,
        rowsPerPageOptions: [50, 100],
        data: {
            current_page: 1,
            per_page: 50
        }
    });

    const codingCompanyPaginate = usePaginate<CompanyProps>({
        name: 'p_f_com',
        template: 'simple',
        onChange: async (data) => {
            const companies = await codingChallengeService.listCompany(data.current_page, data.per_page, searchTitleCompany);
            setCompanies(companies);
        },
        // enableLoadFirst: true,
        isChangeUrl: false,
        pagination: companies,
        rowsPerPageOptions: [20],
        data: {
            current_page: 1,
            per_page: 20
        }
    });

    React.useEffect(() => {
        if (searchTitleCompany || filterTagData.open) {
            codingCompanyPaginate.set({
                current_page: 1,
                per_page: codingCompanyPaginate.data.per_page,
                loadData: true,
            });
        }
    }, [debounceSearchTitleCompany]);

    React.useEffect(() => {
        if (filterTagData.open && companies === null && disableFilterTab) {
            codingCompanyPaginate.set({
                current_page: 1,
                per_page: codingCompanyPaginate.data.per_page,
                loadData: true,
            });
        }
    }, [filterTagData.open]);

    React.useEffect(() => {
        codingChallengePaginate.handleDisableScrollToTop(true);
        codingChallengePaginate.set({ ...codingChallengePaginate.data, current_page: 1, loadData: true });
        setTimeout(() => {
            codingChallengePaginate.handleDisableScrollToTop(false);
        }, 1000);
    }, [filter, debounceSearchTitleChallenge]);

    // React.useEffect(() => {

    //     (async () => {
    //         const studyPlans = await codingChallengeService.listStudy();
    //         setStudyPlans(studyPlans);
    //     })();

    // }, []);

    return (
        <TableContainer>
            {
                !disableFilterTab &&
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    pt: 2
                }}>
                    {
                        showMoreTag ?
                            <>
                                {
                                    tags.map((tag) => <Link
                                        to={"/exercise/tag/" + tag.slug}
                                        key={tag.id}
                                    >
                                        <TagItem
                                            item={tag}
                                        />
                                    </Link>)
                                }
                                <Typography onClick={() => setShowMoreTag(false)} sx={{ ':hover': { opacity: 1 }, opacity: 0.6, ml: 'auto', display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 14 }}>Thu gọn <KeyboardDoubleArrowUpRoundedIcon sx={{ fontSize: 14 }} /></Typography>
                            </>
                            :
                            <>
                                {
                                    [...Array(7)].map((_, index) => tags[index] ?
                                        <Link
                                            to={"/exercise/tag/" + tags[index].slug}
                                            key={'index_' + index}
                                        >
                                            <TagItem
                                                key={tags[index].id}
                                                item={tags[index]}
                                            />
                                        </Link>
                                        : <React.Fragment key={'index_' + index} />
                                    )
                                }
                                {
                                    tags.length > 7 &&
                                    <Typography onClick={() => setShowMoreTag(true)} sx={{ ':hover': { opacity: 1 }, opacity: 0.6, ml: 'auto', display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 14 }}>Mở rộng <KeyboardDoubleArrowDownRoundedIcon sx={{ fontSize: 14 }} /></Typography>
                                }
                            </>
                    }
                </Box>
            }
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    pt: 3,
                    width: '100%',
                }}
            >
                {/* <FormControl
                    size="small"
                    sx={{ flex: '3 1 0%' }}
                >
                    <InputLabel>Danh sách</InputLabel>
                    <Select
                        onOpen={() => {
                            if (studyPlans === null) {
                                (async () => {
                                    const studyPlans = await codingChallengeService.listStudyFeatured();
                                    setStudyPlans(studyPlans);
                                })();
                            }
                        }}
                        value={''}
                        label="StudyPlan"
                        onChange={(e) => {
                            if (studyPlans) {
                                setFilter(prev => ({
                                    ...prev,
                                    studyPlan: prev.studyPlan?.id === e.target.value.toString() ? null : studyPlans.filter(item => item.id.toString() === e.target.value.toString())[0]
                                }));
                            }
                        }}
                    >
                        {
                            studyPlans === null ?
                                [1, 2, 3, 4, 5].map((_, index) => <MenuItem key={index} value={index}>
                                    <Skeleton sx={{ width: 150 }} variant='text' />
                                </MenuItem>)
                                :
                                studyPlans?.map((studyPlan) => (
                                    <MenuItem key={studyPlan.id} value={studyPlan.id}>{studyPlan.title}</MenuItem>
                                ))
                        }
                    </Select>
                </FormControl> */}
                <FormControl size="small" sx={{ flex: '3 1 0%' }}>
                    <InputLabel>Độ khó</InputLabel>
                    <Select
                        value={filter.difficulty}
                        label="Độ khó"
                        onChange={(e) => {
                            setFilter(prev => ({ ...prev, difficulty: (e.target.value as CodingChallengeProps["difficulty"]) || '' }))
                        }}
                        sx={{
                            '.MuiSelect-select': {
                                pr: '8px !important',
                            }
                        }}
                        endAdornment={filter.difficulty && (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilter(prev => ({ ...prev, difficulty: null }));
                                    }}
                                    size="small"
                                    sx={{ mr: 1 }}
                                >
                                    <CloseRounded fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        )}
                    >
                        <MenuItem value='easy'>Dễ</MenuItem>
                        <MenuItem value='medium'>Trung bình</MenuItem>
                        <MenuItem value='hard'>Khó</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ flex: '4 1 0%' }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        value={filter.status}
                        label="Trạng thái"
                        onChange={(e) => {
                            setFilter(prev => ({ ...prev, status: e.target.value }))
                        }}
                        sx={{
                            '.MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                pr: '8px !important',
                            },
                            '.MuiListItemText-root': {
                                m: 0,
                            },
                            '.MuiListItemText-primary': {
                                lineHeight: '22px',
                            }
                        }}
                        endAdornment={filter.status && (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilter(prev => ({ ...prev, status: '' }));
                                    }}
                                    size="small"
                                    sx={{ mr: 1 }}
                                >
                                    <CloseRounded fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        )}
                    >
                        {
                            Object.keys(listStatusFilter).map(key =>
                                <MenuItem key={key} value={key}>
                                    <ListItemIcon>
                                        {listStatusFilter[key].icon}
                                    </ListItemIcon>
                                    <ListItemText>{listStatusFilter[key].title}</ListItemText>
                                </MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ flex: '3 1 0%' }}>
                    <InputLabel>Thẻ</InputLabel>
                    <Select
                        value={''}
                        label="Thẻ"
                        onChange={(e) => {
                            e.stopPropagation();
                        }}
                        onClick={(e) => {

                            if ((e.target as HTMLElement).classList.contains('MuiBackdrop-root')) {
                                setFilterTagData(prev => ({ ...prev, open: false }));
                                return;
                            }

                            setFilterTagData(prev => ({ ...prev, open: true }));
                        }}
                        open={filterTagData.open}
                    >
                        <Box
                            sx={{
                                maxWidth: 500,
                                width: 500,
                                pl: 3,
                                pr: 3,
                                pb: 3,

                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            {
                                (() => {

                                    const tabs: TabsProps['tabs'] = [];

                                    if (!disableFilterTab) {
                                        tabs.push({
                                            title: 'Topics',
                                            content: () => <Box className="custom_scroll" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', maxHeight: 250 }}>
                                                <TextField
                                                    fullWidth
                                                    size='small'
                                                    placeholder='Lọc theo chủ đề'
                                                    sx={{ mb: 1 }}
                                                    value={searchTitleTag}
                                                    onChange={(e) => setSearchTitleTag(e.target.value)}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">
                                                            <SearchRoundedIcon />
                                                        </InputAdornment>
                                                    }}
                                                />
                                                {
                                                    (() => {
                                                        const tagAfterFilter = searchTitleTag.trim() !== '' ? tags.filter(item => levenshteinDistance(searchTitleTag.toLowerCase(), item.title.toLowerCase()) <= 3 || item.title.toLowerCase().includes(searchTitleTag.toLowerCase())) : tags;

                                                        const result = [
                                                            <React.Fragment
                                                                key={1}
                                                            >
                                                                {
                                                                    filterTagData.expand_tag || tagAfterFilter.length <= 15 ?
                                                                        tagAfterFilter.map(item => (
                                                                            <TagItem
                                                                                key={item.id}
                                                                                item={item}
                                                                                active={filter.tags.findIndex((itemActive) => itemActive.id.toString() === item.id.toString()) > -1}
                                                                                onClick={() => {
                                                                                    setFilter(prev => ({
                                                                                        ...prev,
                                                                                        tags: prev.tags.findIndex((itemActive) => itemActive.id.toString() === item.id.toString()) > -1 ? prev.tags.filter((itemActive) => itemActive.id.toString() !== item.id.toString()) : [...prev.tags, item]
                                                                                    }));
                                                                                    setFilterTagData(prev => ({ ...prev, open: false }));
                                                                                }}
                                                                            />
                                                                        ))
                                                                        :
                                                                        [...Array(10)].map((_, index) => (tagAfterFilter[index] ?
                                                                            <TagItem
                                                                                key={tagAfterFilter[index].id}
                                                                                item={tagAfterFilter[index]}
                                                                                active={filter.tags.findIndex((itemActive) => itemActive.id.toString() === tagAfterFilter[index].id.toString()) > -1}
                                                                                onClick={() => {
                                                                                    setFilter(prev => ({
                                                                                        ...prev,
                                                                                        tags: prev.tags.findIndex((itemActive) => itemActive.id.toString() === tagAfterFilter[index].id.toString()) > -1 ? prev.tags.filter((itemActive) => itemActive.id.toString() !== tagAfterFilter[index].id.toString()) : [...prev.tags, tagAfterFilter[index]]
                                                                                    }));
                                                                                    setFilterTagData(prev => ({ ...prev, open: false }));
                                                                                }}
                                                                            />
                                                                            :
                                                                            <React.Fragment key={'index_' + index} />
                                                                        ))
                                                                }</React.Fragment>
                                                        ]
                                                        result.push(
                                                            <React.Fragment
                                                                key={2}
                                                            >
                                                                {
                                                                    filterTagData.expand_tag ?
                                                                        <Typography sx={{ fontSize: 14, width: '100%', color: 'primary.main', cursor: 'pointer' }} onClick={() => setFilterTagData(prev => ({ ...prev, expand_tag: false }))}>Thu gọn</Typography>
                                                                        :
                                                                        tagAfterFilter.length <= 15 ? <></> :
                                                                            <Typography sx={{ fontSize: 14, width: '100%', color: 'primary.main', cursor: 'pointer' }} onClick={() => setFilterTagData(prev => ({ ...prev, expand_tag: true }))}>Mở rộng</Typography>
                                                                }
                                                            </React.Fragment>
                                                        );
                                                        return result;
                                                    })()

                                                }
                                            </Box>
                                        });
                                    }
                                    if (!disableFilterCompnay) {
                                        tabs.push({
                                            title: 'Công ty',
                                            content: () => <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <TextField
                                                    fullWidth
                                                    size='small'
                                                    placeholder='Lọc theo công ty'
                                                    sx={{ mb: 1 }}
                                                    value={searchTitleCompany}
                                                    onChange={(e) => setSearchTitleCompany(e.target.value)}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">
                                                            <SearchRoundedIcon />
                                                        </InputAdornment>
                                                    }}
                                                />
                                                {
                                                    codingCompanyPaginate.isLoading || companies === null ?
                                                        <>
                                                            {
                                                                companies ?
                                                                    companies.data.map(item => (
                                                                        <Skeleton key={item.slug} sx={{ borderRadius: 4, }} variant='rounded'>
                                                                            <CompanyItem item={item} />
                                                                        </Skeleton>
                                                                    ))
                                                                    :
                                                                    [...Array(20)].map((_, index) => (
                                                                        <Skeleton key={index} variant='rounded' sx={{ borderRadius: 4, height: 32, width: widthSkeletonCompanyData[index] ?? 100, }} />
                                                                    ))
                                                            }
                                                        </>
                                                        :
                                                        companies !== null && companies.data.map(compnay => (
                                                            <CompanyItem
                                                                item={compnay}
                                                                active={filter.companies.findIndex((itemActive) => itemActive.id.toString() === compnay.id.toString()) > -1}
                                                                onClick={() => {
                                                                    setFilter(prev => ({
                                                                        ...prev,
                                                                        companies: prev.companies.findIndex((itemActive) => itemActive.id.toString() === compnay.id.toString()) > -1 ? prev.companies.filter((itemActive) => itemActive.id.toString() !== compnay.id.toString()) : [...prev.companies, compnay]
                                                                    }));
                                                                    setFilterTagData(prev => ({ ...prev, open: false }));
                                                                }}
                                                            />
                                                        ))
                                                }
                                                <Box
                                                    sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}

                                                >
                                                    {
                                                        codingCompanyPaginate.component
                                                    }
                                                </Box>
                                            </Box>
                                        });
                                    }

                                    return <Tabs
                                        name="filter_tag"
                                        onChangeTab={(index) => {
                                            if (((index === 1 && !disableFilterCompnay) || (index === 0 && disableFilterCompnay)) && companies === null) {
                                                codingCompanyPaginate.set({
                                                    current_page: 1,
                                                    per_page: codingCompanyPaginate.data.per_page,
                                                    loadData: true,
                                                });
                                            }
                                        }}
                                        tabs={tabs}
                                    />
                                })()
                            }

                        </Box>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    size="small"
                    sx={{ flex: 6 }}
                    label="Câu hỏi"
                    variant="outlined"
                    value={searchTitleChallenge}
                    onChange={(e) => setSearchTitleChallenge(e.target.value)}
                />
            </Box>
            <Box
                sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pt: 2, alignItems: 'center' }}
            >
                {
                    filter.studyPlan ?
                        <StudyPlanItem
                            item={filter.studyPlan}
                            onClick={() => {
                                setFilter(prev => ({
                                    ...prev,
                                    studyPlan: null
                                }));
                            }}
                        />
                        : null
                }
                {
                    filter.tags.map(item => <TagItem
                        key={item.id}
                        item={item}
                        onClick={() => {
                            setFilter(prev => ({
                                ...prev,
                                tags: prev.tags.filter((itemActive) => itemActive.id.toString() !== item.id.toString())
                            }));
                        }}
                    />)
                }
                {
                    filter.companies.map(item => <CompanyItem
                        key={item.id}
                        item={item}
                        onClick={() => {
                            setFilter(prev => ({
                                ...prev,
                                companies: prev.companies.filter((itemActive) => itemActive.id.toString() !== item.id.toString())
                            }));
                        }}
                    />)
                }

            </Box>
            <Table ref={tableRef} sx={{
                mt: 2,
                borderCollapse: 'separate',
                borderSpacing: '0 8px', // Tạo khoảng cách giữa các hàng
            }} size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{
                            width: 100,
                            border: 'none',
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                        }}></TableCell>
                        <TableCell sx={{
                            border: 'none',
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                        }}>Tên</TableCell>
                        <TableCell sx={{
                            border: 'none',
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                        }}>Số lượng bài nộp</TableCell>
                        <TableCell sx={{
                            border: 'none',
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                        }}>Tỉ lệ</TableCell>
                        <TableCell sx={{
                            border: 'none',
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                        }}>Độ khó</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        premiumContent.show ?
                            <TableRow>
                                <TableCell colSpan={100}>
                                    {premiumContent.component}
                                </TableCell>
                            </TableRow>
                            :
                            <>
                                {
                                    codingChallengePaginate.isLoading || codingChallenge === null ?
                                        [...Array(codingChallenge?.data?.length ?? 20)].map((_, index) => (<TableRow key={index}>
                                            <TableCell></TableCell>
                                            <TableCell>
                                                <Skeleton />
                                            </TableCell>
                                            <TableCell><Skeleton /></TableCell>
                                            <TableCell><Skeleton /></TableCell>
                                            <TableCell>
                                                <Skeleton />
                                            </TableCell>
                                        </TableRow>))
                                        :
                                        codingChallenge?.data?.length > 0 ?
                                            codingChallenge?.data?.map((item, index) => <TableRow
                                                key={item.id}
                                                sx={{
                                                    cursor: 'pointer',
                                                    backgroundColor: index % 2 === 0 ? 'background.paper' : 'action.hover', // Thêm màu khác nhau cho dòng chẵn lẻ
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'action.hover',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                        '& td:first-of-type': {
                                                            borderLeftColor: 'primary.main', // Border trái chuyển sang màu xanh
                                                        },
                                                        '& td': {
                                                            borderTop: '1px solid',
                                                            borderBottom: '1px solid',
                                                            borderColor: 'primary.main', // Border trên và dưới chuyển sang màu xanh
                                                        },
                                                        '& td:last-child': {
                                                            borderRight: '1px solid',
                                                            borderColor: 'primary.main', // Border phải chuyển sang màu xanh
                                                        },
                                                    },
                                                    // Bo tròn các góc của hàng
                                                    '& td:first-of-type': {
                                                        borderTopLeftRadius: 8,
                                                        borderBottomLeftRadius: 8,
                                                        borderLeft: '4px solid transparent', // Thêm border trái mặc định
                                                    },
                                                    '& td:last-child': {
                                                        borderTopRightRadius: 8,
                                                        borderBottomRightRadius: 8,
                                                    },
                                                    '& td': {
                                                        borderTop: '1px solid transparent',
                                                        borderBottom: '1px solid transparent',
                                                    },
                                                }}
                                                onClick={() => {
                                                    navigate('/exercise/' + item.slug);
                                                }}
                                            >
                                                <TableCell sx={{
                                                    border: 'none',
                                                    borderLeft: '4px solid transparent',
                                                    borderLeftColor: item.paid_only ? 'warning.main' : 'transparent',
                                                }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 1,
                                                        alignItems: 'center',
                                                    }}>
                                                        {
                                                            Boolean(!session.isLoading && session.data.challenge_solved[item.id]) &&
                                                            <Tooltip title={listStatusFilter.solved.title}>{listStatusFilter.solved.icon}</Tooltip>
                                                        }
                                                        {
                                                            Boolean(!session.isLoading && session.data.challenge_attempted[item.id]) &&
                                                            <Tooltip title={listStatusFilter.attempted.title}>{listStatusFilter.attempted.icon}</Tooltip>
                                                        }
                                                        {item.paid_only ? <Tooltip title="Dành riêng cho người dùng trả phí"><HttpsRoundedIcon color="warning" /></Tooltip> : null}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ border: 'none' }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.875rem',
                                                            fontWeight: 500,
                                                            ':hover': {
                                                                color: 'primary.main',
                                                                textDecoration: 'none',
                                                            },
                                                            // Thêm style mới để giữ màu khi hover vào TableRow
                                                            '.MuiTableRow-root:hover &': {
                                                                color: 'text.primary',
                                                            },
                                                            // Chỉ đổi màu khi hover trực tiếp vào title
                                                            '&:hover': {
                                                                color: 'primary.main !important',
                                                            },
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                        }}
                                                        component={Link}
                                                        to={'/exercise/' + item.slug}
                                                    >
                                                        {item.order}. {item.title}
                                                    </Typography>
                                                    {item.paid_only ? <Tooltip title="Dành riêng cho người dùng trả phí">
                                                        <Chip label="Premium" size='small' sx={{
                                                            backgroundColor: 'warning.main',
                                                            color: 'white',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            height: 20,
                                                        }} />
                                                    </Tooltip> : null}
                                                </TableCell>
                                                <TableCell sx={{
                                                    border: 'none',
                                                    fontSize: '0.875rem',
                                                    color: 'text.secondary',
                                                }}>{nFormatter((item.number_of_submissions))}</TableCell>
                                                <TableCell sx={{
                                                    border: 'none',
                                                    fontSize: '0.875rem',
                                                    color: 'text.secondary',
                                                }}>{Math.round(item.success_rate * 100) / 100}%</TableCell>
                                                <TableCell sx={{ border: 'none' }}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        <DifficultyItem
                                                            difficulty={item.difficulty}
                                                        />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>)
                                            :
                                            <TableRow>
                                                <TableCell colSpan={100}>
                                                    <NotFound
                                                        title='Không tìm thấy câu hỏi'
                                                        subTitle='Hãy thử thay đổi bộ lọc để có thể nhìn thấy nhiều câu hỏi hơn'
                                                    />
                                                </TableCell>
                                            </TableRow>
                                }
                                {
                                    codingChallenge?.last_page !== 1 &&
                                    <TableRow>
                                        <TableCell colSpan={100}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center',
                                                    pt: 1,
                                                }}
                                            >
                                                <Box sx={{ mr: 1, pt: 0.2 }}>Tổng: {codingChallenge?.total} câu hỏi</Box>
                                                {
                                                    codingChallengePaginate.component
                                                }
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                }
                            </>

                    }


                </TableBody>
            </Table>
        </TableContainer >
    )
}

export default ProblemsTable


export function colorDifficulty(difficulty: CodingChallengeProps['difficulty']): string {
    switch (difficulty) {
        case 'easy':
            return 'rgb(0, 175, 155)'
        case 'medium':
            return 'rgb(255, 184, 0)'
        case 'hard':
            return 'rgb(255, 45, 85)'
    }
}

export function convertDifficultyToVN(difficulty: CodingChallengeProps['difficulty']): string {
    switch (difficulty) {
        case 'easy':
            return 'Dễ'
        case 'medium':
            return 'Trung bình'
        case 'hard':
            return 'Khó'
    }
}

const widthSkeletonCompany = [80, 90, 100, 110, 120];

const widthSkeletonCompanyData = [...Array(20)].map(() => widthSkeletonCompany[Math.floor(Math.random() * widthSkeletonCompany.length)]);


export function TagItem({ item, active, onClick }: { item: ChallengeTagProps, active?: boolean, onClick?: React.MouseEventHandler<HTMLDivElement> }) {
    return <Box
        sx={{
            textTransform: 'unset',
            fontSize: 14,
            padding: '4px 12px',
            backgroundColor: active ? 'primary.main' : 'divider',
            color: active ? 'primary.contrastText' : 'text.primary',
            borderRadius: '20px', // Bo tròn hơn
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'all 0.2s ease-in-out', // Thêm hiệu ứng
            '&:hover': {
                backgroundColor: active ? 'primary.dark' : 'action.hover',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            },
            border: active ? 'none' : '1px solid rgba(0,0,0,0.12)',
            height: '32px',
        }}
        onClick={onClick}
    >
        {item.title}
        {item.challenge_count ? (
            <Chip
                label={item.challenge_count}
                size='small'
                sx={{
                    pointerEvents: 'none',
                    backgroundColor: active ? 'rgba(255,255,255,0.2)' : '#ed6c02',
                    ml: 1,
                    color: 'white',
                    height: '20px',
                    '& .MuiChip-label': {
                        px: 1,
                        fontSize: '0.75rem',
                    }
                }}
            />
        ) : null}
    </Box>
}


export function StudyPlanItem({ item, active, onClick }: { item: StudyPlanProps, active?: boolean, onClick?: React.MouseEventHandler<HTMLDivElement> }) {
    return <Box
        sx={{
            textTransform: 'unset',
            fontSize: 12,
            padding: '0px 8px',
            backgroundColor: active ? 'primary.main' : 'divider',
            color: active ? 'primary.contrastText' : 'unset',
            borderRadius: 4,
            cursor: 'pointer',
        }}
        onClick={onClick}
    >
        {item.title}
        <Chip label={item.challenge_count} size='small' sx={{ pointerEvents: 'none', backgroundColor: '#ed6c02', ml: 1, color: 'white' }} />
    </Box>
}

export function DifficultyItem({ difficulty, onClick, active }: { difficulty: CodingChallengeProps["difficulty"], onClick?: React.MouseEventHandler<HTMLDivElement>, active?: boolean }) {
    return <Box
        sx={{
            textTransform: 'unset',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '4px 12px',
            backgroundColor: active ? `${colorDifficulty(difficulty)}` : 'transparent', // Thêm độ trong suốt
            color: active ? 'white' : colorDifficulty(difficulty),
            minWidth: active ? 80 : 'unset',
            border: active ? `1px solid ${colorDifficulty(difficulty)}` : 'none',
            borderRadius: '16px', // Bo tròn hơn
            height: '28px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: onClick ? 'pointer' : 'default',
            transition: 'all 0.2s ease-in-out',
            userSelect: 'none',
            '&:hover': onClick ? {
                backgroundColor: `${colorDifficulty(difficulty)}25`,
                transform: 'translateY(-1px)',
                boxShadow: `0 2px 4px ${colorDifficulty(difficulty)}20`,
            } : {},
        }}
        onClick={onClick}
    >
        {convertDifficultyToVN(difficulty)}
    </Box>
}