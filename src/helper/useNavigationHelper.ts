import { useLocation, useNavigate, Location } from "react-router-dom";

type NavigationState = {
    from?: Location;
};

export function useNavigationHelpers() {
    const navigate = useNavigate();
    const location = useLocation();

    const goTo = (to: string) => {
        navigate(to, {
            state: { from: location } satisfies NavigationState,
        });
    };

    const restoreLocation = (from: Location) =>
        `${from.pathname}${from.search}${from.hash}`;

    return {
        goTo,

        goHome: () => goTo("/"),
        goToAnime: () => goTo("/anime"),
        goToAnimeDetail: (id: string | number) => goTo(`/anime/${id}`),

        goBack: () => {
            const state = location.state as NavigationState | null;

            if (window.history.length > 1) {
                navigate(-1);
                return;
            }

            if (state?.from) {
                navigate(restoreLocation(state.from), { replace: true });
                return;
            }

            navigate("/", { replace: true });
        },
    };
}