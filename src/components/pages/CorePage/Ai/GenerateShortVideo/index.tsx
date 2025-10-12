import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Container, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { PaginationProps } from 'components/atoms/TablePagination';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import generateShortVideoService, { IGenerateShortVideo } from 'services/generateShortVideoService';

const GenerateShortVideoList = () => {
	const navigate = useNavigate();
	const [videos, setVideos] = React.useState<PaginationProps<IGenerateShortVideo> | null>(null);

	const paginate = usePaginate({
		name: 'generate_video',
		pagination: videos,
		rowsPerPageOptions: [10, 20, 50, 100],
		data: {
			current_page: 1,
			per_page: 10,
		},
		onChange: async (data) => {
			const res = await generateShortVideoService.getGenerateShortVideoList();
			if (res) {
				setVideos(res);
				return res;
			}
			return null;
		}
	});

	React.useEffect(() => {
		paginate.set({
			current_page: 1,
			per_page: paginate.data.per_page,
			loadData: true,
		});
	}, []);

	const handleCreateNew = () => {
		navigate('/ai/generate-short-video/new');
	};

	const handleClickVideo = (id: string) => {
		navigate(`/ai/generate-short-video/${id}`);
	};

	return (
		<Container maxWidth="xl">
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, mt: 2, justifyContent: 'space-between' }}>
				<Typography variant="h5">Danh sách video</Typography>
				<Button
					variant="contained"
					size="small"
					onClick={handleCreateNew}
					startIcon={<AddIcon />}
				>
					Tạo mới
				</Button>
			</Box>

			<Paper elevation={3} sx={{ borderRadius: 2 }}>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Tiêu đề</TableCell>
								<TableCell>Chủ đề</TableCell>
								<TableCell>Ngôn ngữ</TableCell>
								<TableCell>Trạng thái</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{videos ?
								videos.data.map((video) => (
									<TableRow
										key={video.id}
										hover
										onClick={() => handleClickVideo(video.id)}
										sx={{ cursor: 'pointer' }}
									>
										<TableCell>{video.title}</TableCell>
										<TableCell>{video.topic}</TableCell>
										<TableCell>{video.language === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'}</TableCell>
										<TableCell>{video.generate_status}</TableCell>
									</TableRow>
								)) :
									Array.from({ length: 10 }).map((_, index) => (
											<TableRow key={index}>
												<TableCell>
													<Skeleton animation="wave" width="80%" />
												</TableCell>
												<TableCell>
													<Skeleton animation="wave" width="60%" />
												</TableCell>
												<TableCell>
													<Skeleton animation="wave" width="40%" />
												</TableCell>
												<TableCell>
													<Skeleton animation="wave" width="50%" />
												</TableCell>
											</TableRow>
										))
								}
						</TableBody>
					</Table>
				</TableContainer>
				{paginate.component}
			</Paper>
		</Container>
	);
};

export default GenerateShortVideoList;