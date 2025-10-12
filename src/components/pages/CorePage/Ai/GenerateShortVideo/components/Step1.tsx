import React from 'react';
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import generateShortVideoService, { IGenerateShortVideo } from 'services/generateShortVideoService';
import { useNavigate } from 'react-router-dom';

const Step1 = ({ onNext, generateShortVideo }: { onNext: () => void, generateShortVideo: IGenerateShortVideo | null }) => {

    const [title, setTitle] = React.useState(generateShortVideo?.title || '');
    const [topic, setTopic] = React.useState(generateShortVideo?.topic || '');
    const [language, setLanguage] = React.useState(generateShortVideo?.language || 'vi');

    React.useEffect(() => {
        setTitle(generateShortVideo?.title || '');
        setTopic(generateShortVideo?.topic || '');
        setLanguage(generateShortVideo?.language || 'vi');
    }, [generateShortVideo]);

    const navigate = useNavigate();

    const handleNext = () => {

        if (!generateShortVideo) {
            generateShortVideoService.generateShortVideo({ title, topic, language }).then((res) => {
                if (res) {
                    navigate(`/ai/generate-short-video/${res.id}?step=2`);
                }
            });
        } else {
            onNext();
        }
    };

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>

                    <Box>
                        <Typography sx={{ mb: 1 }}>Tiêu đề</Typography>
                        <TextField
                            fullWidth
                            placeholder="Nhập tiêu đề" 
                            size="small"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Box>

                    <Box>
                        <Typography  sx={{ mb: 1 }}>Video Topic</Typography>
                        <TextField
                            fullWidth
                            placeholder="e.g. Top 5 Travel Tips for Summer"
                            size="small"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </Box>

                    <Box>
                        <Typography sx={{ mb: 1 }}>Ngôn ngữ</Typography>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            defaultValue="vi"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <MenuItem value="vi">Tiếng Việt</MenuItem>
                            <MenuItem value="en">Tiếng Anh</MenuItem>
                        </TextField>
                    </Box>
                </Box>


            </Box>
            <Button
                variant="contained"
                sx={{
                    mt: 2,
                    ml: 'auto',
                }}
                onClick={handleNext}
            >
                {generateShortVideo ? 'Tiếp tục' : 'Tạo video'}
            </Button>
        </Box>
    );
};

export default Step1;
