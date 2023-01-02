import { colors } from "@mui/material";
import { VariantType } from "notistack";

export { };

declare global {

    type ANY = any //eslint-disable-line
    interface Window {
        [key: string]: ANY,
        __plugins: object,
        __disable_scroll: boolean,
        __indexDB: null | ANY,
        __indexDBStore: { [key: string]: ANY },
        __indexDBSuccess: false | true,
        __course_reactions?: { [key: ID]: '[none]' | 'love' },
        __afterLogin: {
            [key: string]: ANY
        },
        showMessage: (message: string | MessageFromApiProps, type?: VariantType | undefined, snackbarOrigin?: SnackbarOrigin | undefined) => void
    }

    interface JsonFormat {
        [key: string]: string | number | boolean | null | JsonFormat | ANY
    }

    interface PostTypeProps {
        [key: string]: ANY,
        id: ID,
        title: string,
        status: 'publish' | 'draft' | 'pending' | 'trash',
        status_old: 'publish' | 'draft' | 'pending' | 'trash',
        visibility: 'public' | 'password' | 'private',
        password: string,
        post_date_gmt: string,
        starred: 1 | 0,
        id: string,
        created_at: string,
        updated_at: string,
        meta: string | JsonFormat,
    }

    type ID = string | number

}
declare module "@mui/material/styles/createTheme" {
    interface Theme {
        primaryColor: keyof typeof colors,
        secondaryColor: keyof typeof colors,
    }

    interface ThemeOptions {
        primaryColor?: keyof typeof colors,
        secondaryColor?: keyof typeof colors,
    }
}
declare module "@mui/material/styles/createPalette" {
    interface Palette {
        header: {
            background: string
        };
        footer: {
            background: string
        };
        body: {
            background: string
        },
        menu: {
            background: string
        },
        backgroundSelected: string,
        fileSelected: string,
        fileDropSelected: stirng,
        link: string,
        dividerDark: string,
        icon: string,
    }

    interface PaletteOptions {
        header?: {
            background: string
        };
        footer?: {
            background: string
        };
        body?: {
            background: string
        },
        menu?: {
            background: string
        },
        backgroundSelected?: string,
        fileSelected?: string,
        fileDropSelected?: stirng,
        link?: string,
        dividerDark?: string,
        icon?: string,
    }
}