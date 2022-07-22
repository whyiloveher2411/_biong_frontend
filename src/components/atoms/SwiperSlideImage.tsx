import { Autoplay, Navigation, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import Swiper React components
import { Swiper, SwiperSlide as SwiperSlideReact } from "swiper/react";
import makeCSS from "./makeCSS";

const useStyle = makeCSS({
    swiper: {
        width: '100%',
        height: 'var(--height)',
        '& .swiper-slide': {
            cursor: 'pointer',
            textAlign: 'center',
            fontSize: '18px',
            /* Center slide text vertically */
            display: 'flex',
            WebkitBoxPack: 'center',
            MsFlexPack: 'center',
            WebkitJustifyContent: 'center',
            justifyContent: 'center',
            WebkitBoxAlign: 'center',
            MsFlexAlign: 'center',
            WebkitAlignItems: 'center',
            alignItems: 'center',
            height: 'var(--height)',
        },
        '& .swiper-wlide': {
            '& img': {
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            }
        }
    },
});

function SwiperSlideImage<T>({
    items,
    renderItem,
    spaceBetween = 30,
    hashNavigation = {
        watchState: true
    },
    pagination = {
        clickable: true,
        dynamicBullets: false,
    },
    navigation = true,
    modules = [Autoplay, Pagination, Navigation],
    heightItem = 270,
    heightSwiper = 340,
    loop = true,
    autoplay = {
        delay: 2500,
        disableOnInteraction: false,
    },
}: {
    items: Array<T>,
    renderItem: (item: T, index: number) => React.ReactNode,
    spaceBetween?: number,
    hashNavigation?: {
        watchState: boolean
    },
    pagination?: {
        clickable: boolean,
        dynamicBullets: boolean,
    },
    navigation?: boolean,
    modules?: Array<ANY>
    heightItem?: number
    heightSwiper?: number,
    loop?: boolean,
    autoplay?: {
        delay: number,
        disableOnInteraction: boolean,
    },
}) {

    const classes = useStyle();

    return (
        <Swiper
            spaceBetween={spaceBetween}
            hashNavigation={hashNavigation}
            pagination={pagination}
            navigation={navigation}
            modules={modules}
            className={classes.swiper}
            autoplay={autoplay}
            loop={loop}
            style={{ ['--height' as string]: heightSwiper + 'px' }}
        >
            {
                items.map((item, index) => (
                    <SwiperSlideReact style={{ ['--height' as string]: heightItem + 'px' }} key={index}>{renderItem(item, index)}</SwiperSlideReact>
                ))
            }
        </Swiper >
    )
}

export default SwiperSlideImage