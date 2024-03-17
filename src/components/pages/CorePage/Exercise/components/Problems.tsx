import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { PaginationProps } from 'components/atoms/TablePagination';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import { Link } from 'react-router-dom';
import codingChallengeService, { CodingChallengeProps } from 'services/codingChallengeService';

function Problems() {

    const [codingChallenge, setCodingChallenge] = React.useState<PaginationProps<CodingChallengeProps> | null>(null);

    // React.useEffect(() => {

    //     (async () => {

    //         const codingChallenge = await codingChallengeService.list();

    //         setCodingChallenge(codingChallenge);

    //     })();

    // }, []);

    const codingChallengePaginate = usePaginate<CodingChallengeProps>({
        name: 'p_cha',
        template: 'page',
        onChange: async (data) => {
            const codingChallenge = await codingChallengeService.list(data.current_page);

            setCodingChallenge(codingChallenge);
            // updateListingSubmissions(data.current_page);
        },
        enableLoadFirst: true,
        isChangeUrl: true,
        pagination: codingChallenge,
        rowsPerPageOptions: [20],
        data: {
            current_page: 1,
            per_page: 20
        }
    });


    return (<TableContainer>
        <Table sx={{ mt: 3 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>số lượng bài nộp</TableCell>
                    <TableCell>Tỉ lệ</TableCell>
                    <TableCell>Độ khó</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    codingChallengePaginate.isLoading ?
                        [...Array(codingChallenge?.data.length ?? 20)].map((_, index) => (<TableRow key={index}>
                            <TableCell></TableCell>
                            <TableCell>
                                <Skeleton />
                            </TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell>
                                <Skeleton />
                            </TableCell>
                        </TableRow>)
                        )
                        :
                        codingChallenge && codingChallenge.data.map((item) => <TableRow key={item.id}>
                            <TableCell></TableCell>
                            <TableCell>
                                <Typography sx={{ ':hover': { color: 'link' } }} component={Link} to={'/exercise/' + item.slug} variant='h5' fontWeight={600}> {item.id}. {item.title}</Typography>
                            </TableCell>
                            <TableCell>{item.number_of_submissions?.toLocaleString()}</TableCell>
                            <TableCell>{Math.round(item.success_rate * 100) / 100}%</TableCell>
                            <TableCell sx={{ color: colorDifficulty(item.difficulty) }}>
                                {convertDifficultyToVN(item.difficulty)}
                            </TableCell>
                        </TableRow>)
                }
                <TableRow>
                    <TableCell colSpan={100}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                pt: 1,
                            }}
                        >
                            {
                                codingChallengePaginate.component
                            }
                        </Box>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

    </TableContainer>)
}

export default Problems

function colorDifficulty(difficulty: CodingChallengeProps['difficulty']): string {
    switch (difficulty) {
        case 'easy':
            return 'rgb(0, 175, 155)'
        case 'medium':
            return 'rgb(255, 184, 0)'
        case 'hard':
            return 'rgb(255, 45, 85)'
    }
}

function convertDifficultyToVN(difficulty: CodingChallengeProps['difficulty']): string {
    switch (difficulty) {
        case 'easy':
            return 'Dễ'
        case 'medium':
            return 'Trung bình'
        case 'hard':
            return 'Khó'
    }
}