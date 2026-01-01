import { useState, useMemo } from "react";
import { useNavigationHelpers } from "../helper/useNavigationHelper";
import { sampleAnimes } from "../data/anime.mock";
import { useScrollPosition } from "@/context/ScrollPositonContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Anime } from "@/models/Anime";
import EntityListView, { FilterOption, SortOption } from "@/components/EntityListView";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeList() {
    const { goToAnimeDetail } = useNavigationHelpers();
    const { setScroll, getScroll } = useScrollPosition();
    const [loading, setLoading] = useState(true);

    // Simulate loading
    useState(() => {
        setTimeout(() => setLoading(false), 2000);
    });

    // Extract unique genres from all anime
    const genreOptions = useMemo(() => {
        const genres = new Set<string>();
        sampleAnimes.forEach((anime) => {
            anime.genres.forEach((g) => genres.add(g.name));
        });
        return Array.from(genres).map((name) => ({ value: name, label: name }));
    }, []);

    // Extract unique studios
    const studioOptions = useMemo(() => {
        const studios = new Set<string>();
        sampleAnimes.forEach((anime) => {
            anime.studios.forEach((s) => studios.add(s.name));
        });
        return Array.from(studios).map((name) => ({ value: name, label: name }));
    }, []);

    const filterOptions: FilterOption[] = [
        {
            id: "genres",
            label: "Genre",
            options: genreOptions,
        },
        {
            id: "studios",
            label: "Studio",
            options: studioOptions,
        },
        {
            id: "status",
            label: "Status",
            options: [
                { value: "finished_airing", label: "Finished Airing" },
                { value: "currently_airing", label: "Currently Airing" },
                { value: "not_yet_aired", label: "Not Yet Aired" },
            ],
        },
        {
            id: "media_type",
            label: "Type",
            options: [
                { value: "tv", label: "TV" },
                { value: "movie", label: "Movie" },
                { value: "ova", label: "OVA" },
                { value: "special", label: "Special" },
                { value: "ona", label: "ONA" },
            ],
        },
    ];

    const sortOptions: SortOption[] = [
        { value: "title-asc", label: "Title (A-Z)" },
        { value: "title-desc", label: "Title (Z-A)" },
        { value: "mean-desc", label: "Rating (High to Low)" },
        { value: "mean-asc", label: "Rating (Low to High)" },
        { value: "mal_id-desc", label: "Newest First" },
        { value: "mal_id-asc", label: "Oldest First" },
    ];

    const renderGridCard = (anime: Anime) => (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
                <img src={anime.main_picture?.medium ?? "https://via.placeholder.com/200x280"} alt={anime.title}
                    className="w-full h-60 object-cover rounded-t-lg"
                />
            </CardContent>
            <CardHeader className="pb-3">
                <CardTitle className="text-base line-clamp-2">{anime.title}</CardTitle>
                <div className="flex items-center justify-between mt-2">
                    {anime.mean && (
                        <Badge variant="secondary" className="text-xs">⭐ {anime.mean}</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                        {anime.media_type.toUpperCase()}
                    </Badge>
                </div>
                {anime.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {anime.genres.slice(0, 2).map((genre) => (
                            <Badge key={genre.id} variant="secondary" className="text-xs">
                                {genre.name}
                            </Badge>
                        ))}
                        {anime.genres.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                                +{anime.genres.length - 2}
                            </Badge>
                        )}
                    </div>
                )}
            </CardHeader>
        </Card>
    );

    const renderListCard = (anime: Anime) => (
        <Card className="hover:shadow-lg transition-shadow">
            <div className="flex flex-row items-center gap-4 p-4">
                <img src={anime.main_picture?.medium ?? "https://via.placeholder.com/100x140"} alt={anime.title}
                    className="w-24 h-36 object-cover rounded"
                />
                <div className="flex-1 space-y-2">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg">{anime.title}</CardTitle>
                        {anime.title_japanese && (
                            <p className="text-sm text-muted-foreground">{anime.title_japanese}</p>
                        )}
                    </CardHeader>
                    <CardContent className="p-0 space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {anime.mean && (
                                <Badge variant="default" className="text-xs">⭐ {anime.mean}</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                                {anime.media_type.toUpperCase()}
                            </Badge>
                            <Badge variant={anime.status === "finished_airing" ? "secondary" : "default"}
                                className="text-xs"
                            >
                                {anime.status.replace(/_/g, " ").toUpperCase()}
                            </Badge>
                        </div>
                        {anime.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {anime.genres.map((genre) => (
                                    <Badge key={genre.id} variant="secondary" className="text-xs">
                                        {genre.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        {anime.studios.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                Studio: {anime.studios.map((s) => s.name).join(", ")}
                            </p>
                        )}
                    </CardContent>
                </div>
            </div>
        </Card>
    );

    // Custom skeleton loaders matching actual card layouts
    const renderGridSkeleton = () => (
        <Card>
            <Skeleton className="h-60 w-full rounded-t-lg" />
            <CardHeader className="pb-3">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between mt-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-8" />
                </div>
                <div className="flex gap-1 mt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                </div>
            </CardHeader>
        </Card>
    );

    const renderListSkeleton = () => (
        <Card>
            <div className="flex flex-row items-center gap-4 p-4">
                <Skeleton className="w-24 h-36 rounded" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="flex gap-1">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
        </Card>
    );

    return (
        <EntityListView
            data={sampleAnimes}
            loading={loading}
            viewType="grid"
            searchPlaceholder="Search anime by title..."
            scrollKey="/anime"
            getScroll={getScroll}
            setScroll={setScroll}
            onItemClick={(anime) => goToAnimeDetail(anime.mal_id)}
            renderGridCard={renderGridCard}
            renderListCard={renderListCard}
            renderGridSkeleton={renderGridSkeleton}
            renderListSkeleton={renderListSkeleton}
            getItemKey={(anime) => anime._id}
            searchFields={["title", "title_english", "title_japanese"]}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            defaultSort="mean-desc"
            itemsPerPage={12}
            itemsPerPageOptions={[8, 12, 24, 48]}
        />
    );
}