import SearchRounded from '@mui/icons-material/SearchRounded';
import { Box, Card, CardContent, Chip, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import { PaginationProps } from 'components/atoms/TablePagination';
import NotFound from 'components/molecules/NotFound';
import useDebounce from 'hook/useDebounce';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import { Link } from 'react-router-dom';
import codingChallengeService, { CompanyProps } from 'services/codingChallengeService';

function TrendingCompanies() {

	const [companies, setCompanies] = React.useState<PaginationProps<CompanyProps> | null>(null);

	// React.useEffect(() => {

	//     (async () => {

	//         const codingChallenge = await codingChallengeService.list();

	//         setCodingChallenge(codingChallenge);

	//     })();

	// }, []);

	const [searchTitleCompany, setSearchTitleCompany] = React.useState('');
	const debounceSearchTitleCompany = useDebounce(searchTitleCompany, 300);

	const companiesPaginate = usePaginate<CompanyProps>({
		name: 'p_com',
		template: 'simple',
		onChange: async (data) => {

			const companies = await codingChallengeService.listCompany(data.current_page, data.per_page, searchTitleCompany);
			setCompanies(companies);
			// updateListingSubmissions(data.current_page);
		},
		isChangeUrl: true,
		pagination: companies,
		rowsPerPageOptions: [20],
		data: {
			current_page: 1,
			per_page: 20
		}
	});


	React.useEffect(() => {
		companiesPaginate.set({
			current_page: 1,
			per_page: companiesPaginate.data.per_page,
			loadData: true,
		});
	}, [debounceSearchTitleCompany]);

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					justifyContent: 'space-between',
					position: 'relative',
					'.paginateSimple': {
						position: 'absolute',
						right: 0,
						top: '50%',
						transform: 'translateY(-50%)',
					}
				}}
			>
				<Typography variant='h4' sx={{ fontWeight: 600 }}>Công Ty Đang Hot </Typography>
				{companiesPaginate.component}
			</Box>
			<Card
				sx={{
					mt: 1,
				}}
			>
				<CardContent>
					<TextField
						placeholder='Tìm kiếm công ty'
						fullWidth
						size="small"
						sx={{
							mb: 2
						}}
						value={searchTitleCompany}
						onChange={(e) => setSearchTitleCompany(e.target.value)}
						InputProps={{
							startAdornment: <InputAdornment position="start">
								<SearchRounded />
							</InputAdornment>
						}}
					/>
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: 1.5,
						}}
					>
						{
							companiesPaginate.isLoading || companies === null ?
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
								companies.data.length > 0 ? companies.data.map(item => (
									<Link
										to={'/exercise/company/' + item.slug}
										key={item.id}
									>
										<CompanyItem
											item={item}
										/>
									</Link>
								))
									:
									<NotFound>
										<Typography sx={{ fontWeight: 600 }}>Không tìm thấy công ty</Typography>
										<Typography variant='body2' sx={{ lineHeight: '16px' }}>Tên công ty có thể không chính xác.</Typography>
									</NotFound>
						}
					</Box>
					{
						companies !== null && companies.last_page !== 1 &&
						<Typography align='right' variant='body2' sx={{ mt: 1 }}>Trang {companies?.current_page} / {companies?.last_page} </Typography>
					}
				</CardContent>
			</Card>
		</>
	)
}

export default TrendingCompanies

export function CompanyItem({ item, active, onClick }: { item: CompanyProps, active?: boolean, onClick?: React.MouseEventHandler<HTMLDivElement> }) {
	return <Box
		sx={{
			textTransform: 'unset',
			fontSize: 12,
			padding: '0px 8px',
			borderRadius: 4,
			cursor: 'pointer',
			backgroundColor: active ? 'primary.main' : 'divider',
			color: active ? 'primary.contrastText' : 'unset',
		}}
		onClick={onClick}
	>
		{item.title}
		<Chip label={item.challenge_count} size='small' sx={{ pointerEvents: 'none', backgroundColor: '#ed6c02', ml: 1, color: 'white' }} />
	</Box>
}

const widthSkeletonCompany = [80, 90, 100, 110, 120];

const widthSkeletonCompanyData = [...Array(20)].map(() => widthSkeletonCompany[Math.floor(Math.random() * widthSkeletonCompany.length)]);