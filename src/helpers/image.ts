import { ImageProps } from "components/atoms/Avatar";
import { convertToURL, validURL } from "./url";

export interface ImageObjectProps {
    [key: string]: ANY,
    link: string,
    type_link: string,
    ext: string,
    width: number,
    height: number
}

export function getFileUrl(file?: string | {
    ext: string,
    link: string,
    type_link: string,
}): string {

    if (!file) {
        return '';
    }

    if (typeof file === 'string') {
        file = JSON.parse(file);
    }

    if (file && typeof file === 'object') {
        return validURL(file.link) ? file.link : convertToURL(convertToURL(process.env.REACT_APP_BASE_URL, 'file/temp/'), file.link);
    }

    return '';
}

export function getImageUrl(img?: string | ImageObjectProps | ImageProps, defaultImage = ''): string {

    if (!img) {
        return defaultImage;
    }

    if (typeof img === 'string') {
        try {
            img = JSON.parse(img);
        } catch (error) {
            img = '';
        }
    }

    if (img && typeof img === 'object') {
        return validURL(img.link) ? img.link : convertToURL(process.env.REACT_APP_BASE_URL, img.link);
    }

    return defaultImage;
}