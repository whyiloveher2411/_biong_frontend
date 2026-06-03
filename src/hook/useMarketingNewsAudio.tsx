import React from 'react';
import { __ } from 'helpers/i18n';
import { buildArticleAudioStreamUrl, MarketingHomePost } from 'services/marketingNewsService';

export type MarketingNewsAudioSession = {
    post: MarketingHomePost;
    streamUrl: string;
};

export type MarketingNewsAudioState = {
    session: MarketingNewsAudioSession | null;
    isPlaying: boolean;
    isLoading: boolean;
    position: number;
    duration: number;
    loadError: boolean;
};

type MarketingNewsAudioContextValue = MarketingNewsAudioState & {
    playPost: (post: MarketingHomePost) => void;
    togglePlay: () => void;
    close: () => void;
    seek: (ratio: number) => void;
    isSessionPost: (post: MarketingHomePost) => boolean;
};

const MarketingNewsAudioContext = React.createContext<MarketingNewsAudioContextValue | null>(null);

const initialState: MarketingNewsAudioState = {
    session: null,
    isPlaying: false,
    isLoading: false,
    position: 0,
    duration: 0,
    loadError: false,
};

export function MarketingNewsAudioProvider({ children }: { children: React.ReactNode }) {
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const [state, setState] = React.useState<MarketingNewsAudioState>(initialState);

    const ensureAudio = React.useCallback(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.preload = 'metadata';
        }
        return audioRef.current;
    }, []);

    const detachListeners = React.useRef<(() => void) | null>(null);

    const bindAudioElement = React.useCallback((audio: HTMLAudioElement) => {
        detachListeners.current?.();

        const onLoadedMetadata = () => {
            setState((prev) => ({
                ...prev,
                duration: Number.isFinite(audio.duration) ? audio.duration : 0,
                isLoading: false,
                loadError: false,
            }));
        };

        const onTimeUpdate = () => {
            setState((prev) => ({
                ...prev,
                position: audio.currentTime,
            }));
        };

        const onWaiting = () => {
            setState((prev) => ({ ...prev, isLoading: true }));
        };

        const onCanPlay = () => {
            setState((prev) => ({ ...prev, isLoading: false }));
        };

        const onPlaying = () => {
            setState((prev) => ({
                ...prev,
                isPlaying: true,
                isLoading: false,
                loadError: false,
            }));
        };

        const onPause = () => {
            setState((prev) => ({ ...prev, isPlaying: false }));
        };

        const onEnded = () => {
            setState((prev) => ({
                ...prev,
                isPlaying: false,
                position: 0,
            }));
            audio.currentTime = 0;
        };

        const onError = () => {
            setState((prev) => ({
                ...prev,
                isPlaying: false,
                isLoading: false,
                loadError: true,
            }));
        };

        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('playing', onPlaying);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);

        detachListeners.current = () => {
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('waiting', onWaiting);
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('playing', onPlaying);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);
        };
    }, []);

    React.useEffect(() => {
        const audio = ensureAudio();
        bindAudioElement(audio);

        return () => {
            detachListeners.current?.();
            audio.pause();
            audio.src = '';
        };
    }, [bindAudioElement, ensureAudio]);

    const loadAndPlay = React.useCallback(
        async (post: MarketingHomePost) => {
            const audio = ensureAudio();
            const streamUrl = buildArticleAudioStreamUrl(post);

            setState({
                session: { post, streamUrl },
                isPlaying: false,
                isLoading: true,
                position: 0,
                duration: 0,
                loadError: false,
            });

            audio.pause();
            audio.src = streamUrl;
            audio.currentTime = 0;

            try {
                await audio.play();
            } catch {
                setState((prev) => ({
                    ...prev,
                    isPlaying: false,
                    isLoading: false,
                    loadError: true,
                }));
            }
        },
        [ensureAudio],
    );

    const playPost = React.useCallback(
        (post: MarketingHomePost) => {
            if (!post.hasAudio) {
                return;
            }

            const audio = ensureAudio();
            const isSame =
                state.session?.post.id === post.id && state.session?.post.year === post.year;

            if (isSame) {
                if (audio.paused) {
                    setState((prev) => ({ ...prev, isLoading: true, loadError: false }));
                    void audio.play().catch(() => {
                        setState((prev) => ({
                            ...prev,
                            isPlaying: false,
                            isLoading: false,
                            loadError: true,
                        }));
                    });
                } else {
                    audio.pause();
                }
                return;
            }

            void loadAndPlay(post);
        },
        [ensureAudio, loadAndPlay, state.session],
    );

    const togglePlay = React.useCallback(() => {
        const audio = ensureAudio();
        if (!state.session) {
            return;
        }
        if (audio.paused) {
            setState((prev) => ({ ...prev, isLoading: true, loadError: false }));
            void audio.play().catch(() => {
                setState((prev) => ({
                    ...prev,
                    isPlaying: false,
                    isLoading: false,
                    loadError: true,
                }));
            });
        } else {
            audio.pause();
        }
    }, [ensureAudio, state.session]);

    const close = React.useCallback(() => {
        const audio = ensureAudio();
        audio.pause();
        audio.src = '';
        setState(initialState);
    }, [ensureAudio]);

    const seek = React.useCallback(
        (ratio: number) => {
            const audio = ensureAudio();
            if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
                return;
            }
            const clamped = Math.min(1, Math.max(0, ratio));
            audio.currentTime = clamped * audio.duration;
            setState((prev) => ({ ...prev, position: audio.currentTime }));
        },
        [ensureAudio],
    );

    const isSessionPost = React.useCallback(
        (post: MarketingHomePost) =>
            state.session?.post.id === post.id && state.session?.post.year === post.year,
        [state.session],
    );

    const value = React.useMemo<MarketingNewsAudioContextValue>(
        () => ({
            ...state,
            playPost,
            togglePlay,
            close,
            seek,
            isSessionPost,
        }),
        [state, playPost, togglePlay, close, seek, isSessionPost],
    );

    return (
        <MarketingNewsAudioContext.Provider value={value}>
            {children}
        </MarketingNewsAudioContext.Provider>
    );
}

export function useMarketingNewsAudio(): MarketingNewsAudioContextValue {
    const ctx = React.useContext(MarketingNewsAudioContext);
    if (!ctx) {
        throw new Error(__('Cần MarketingNewsAudioProvider'));
    }
    return ctx;
}

/** Chiều cao mini player (px): progress 3 + padding 5 + row 36 + padding 5 — khớp spacedev-app */
export const MARKETING_NEWS_MINI_PLAYER_HEIGHT = 49;
