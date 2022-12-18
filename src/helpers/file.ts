import { convertToURL } from "./url";

export function humanFileSize(bytes: number, si = false, dp = 1): string {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

export function downloadFileInServer(courseID: ID, chapterID: ID, chapterIndex: number, lesson: ID, lessonIndex: number, index: number, type = 'resource') {
    const urlPrefixDefault = convertToURL(process.env.REACT_APP_HOST_API_KEY, '/api/frontend/v1.0/');
    const access_token = localStorage.getItem('access_token');
    const href = urlPrefixDefault + 'vn4-e-learning/me/download-resource?access_token=' + access_token + '&c=' + courseID + '&ct=' + chapterID + '&cti=' + chapterIndex + '&ls=' + lesson + '&lsi=' + lessonIndex + '&i=' + index + '&type=' + type;
    let link = document.createElement("a");
    // let names = (href?.split("/") || []);
    // let name = names[names?.length - 1];
    // link.download = name;
    link.href = href;
    document.body.appendChild(link);
    link.click();
    link.remove();
}