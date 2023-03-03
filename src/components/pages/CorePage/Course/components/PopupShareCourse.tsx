import { Box, Button, IconButton } from '@mui/material';
import Icon from 'components/atoms/Icon';
import Tooltip from 'components/atoms/Tooltip';
import FieldForm from 'components/atoms/fields/FieldForm';
import Dialog from 'components/molecules/Dialog';
import { shareButtons } from 'components/organisms/Footer';
import { __ } from 'helpers/i18n';

function PopupShareCourse({ open, onClose }: { open: boolean, onClose: () => void }) {
    return (
        <Dialog
            title={__('Chia sẽ khóa học này')}
            open={open}
            onClose={onClose}
        >
            <Box
                sx={{
                    display: 'flex',
                    height: 48,
                }}
            >
                <FieldForm
                    component='text'
                    config={{
                        title: false,
                        inputProps: {
                            readOnly: true,
                            sx: {
                                borderRadius: '4px 0 0 4px',
                                height: 48,
                            }
                        },
                        size: 'medium',
                    }}
                    name="link_share"
                    post={{
                        link_share: window.location.href.split('/learning')[0],
                    }}
                />
                <Button
                    variant='contained'
                    size='medium'
                    sx={{
                        borderRadius: '0px 4px 4px 0',
                    }}
                    onClick={() => {
                        let item = window.location.href.split('/learning')[0];
                        navigator.clipboard.writeText(item);
                        window.showMessage(__('Đã sao chép liên kết vào bộ nhớ tạm.'), 'info');
                    }}
                >{__('Sao chép')}</Button>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 2,
                }}
            >
                {
                    shareButtons.filter((_it, i) => i !== 1).map((item, index) => (
                        <Tooltip
                            key={index}
                            title={item.name}
                            placement="bottom"
                            arrow
                        >
                            <IconButton
                                size='large'
                                sx={(theme) => ({
                                    border: '1px solid',
                                    borderColor: theme.palette.dividerDark,
                                    color: item.color,
                                })}
                                onClick={() => {
                                    const url = window.location.href.split('/learning')[0];
                                    item.onClick(url)
                                }}
                            >
                                <Icon icon={item.icon} />
                            </IconButton>
                        </Tooltip>
                    ))
                }
            </Box>
        </Dialog>
    )
}

export default PopupShareCourse