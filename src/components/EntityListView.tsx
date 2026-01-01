import { useEffect, useState, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Search, SlidersHorizontal, X } from "lucide-react";

export interface FilterOption {
    id: string;
    label: string;
    options: { value: string; label: string }[];
}

export interface SortOption {
    value: string;
    label: string;
}

export interface EntityListViewProps<T> {
    data: T[];
    loading?: boolean;
    viewType?: "grid" | "list";
    searchPlaceholder?: string;
    scrollKey: string;
    getScroll: (key: string) => number;
    setScroll: (key: string, value: number) => void;
    onItemClick: (item: T) => void;
    renderGridCard: (item: T) => React.ReactNode;
    renderListCard: (item: T) => React.ReactNode;
    renderGridSkeleton?: () => React.ReactNode;
    renderListSkeleton?: () => React.ReactNode;
    getItemKey: (item: T) => string;
    searchFields: (keyof T)[];
    filterOptions?: FilterOption[];
    sortOptions?: SortOption[];
    defaultSort?: string;
    itemsPerPage?: number;
    itemsPerPageOptions?: number[];
}

export default function EntityListView<T extends Record<string, any>>({
    data, loading = false, viewType = "grid", searchPlaceholder = "Search...", scrollKey, getScroll,
    setScroll, onItemClick, renderGridCard, renderListCard, renderGridSkeleton, renderListSkeleton,
    getItemKey, searchFields, filterOptions = [], sortOptions = [], defaultSort = "", itemsPerPage = 20, itemsPerPageOptions = [10, 20, 50, 100]
}: EntityListViewProps<T>) {
    const [isGrid, setIsGrid] = useState(viewType === "grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
    const [sortBy, setSortBy] = useState(defaultSort);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(itemsPerPage);
    const [showFilters, setShowFilters] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Restore scroll position
    useEffect(() => {
        if (containerRef.current && !loading) {
            containerRef.current.scrollTop = getScroll(scrollKey);
        }
    }, [getScroll, scrollKey, loading]);

    // Save scroll position on unmount
    useEffect(() => {
        return () => {
            if (containerRef.current) {
                setScroll(scrollKey, containerRef.current.scrollTop);
            }
        };
    }, [setScroll, scrollKey]);

    // Filter and search logic
    const filteredData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((item) =>
                searchFields.some((field) => {
                    const value = item[field];
                    
                    if (typeof value === "string") {
                        return value.toLowerCase().includes(query);
                    }
                    
                    if (Array.isArray(value)) {
                        return value.some((v: string) =>
                            typeof v === "string" ? v.toLowerCase().includes(query) : false
                        );
                    }
                    return false;
                })
            );
        }

        // Apply filters
        Object.entries(activeFilters).forEach(([filterId, values]) => {
            if (values.length > 0) {
                result = result.filter((item) => {
                    const itemValue = item[filterId];
        
                    if (Array.isArray(itemValue)) {
                        return itemValue.some((v) =>
                            values.includes(typeof v === "object" ? v.name : v)
                        );
                    }
                    return values.includes(String(itemValue));
                });
            }
        });

        // Apply sorting
        if (sortBy) {
            result.sort((a, b) => {
                const [field, order] = sortBy.split("-");
                const aVal = a[field];
                const bVal = b[field];

                if (typeof aVal === "number" && typeof bVal === "number") {
                    return order === "asc" ? aVal - bVal : bVal - aVal;
                }

                const aStr = String(aVal || "");
                const bStr = String(bVal || "");
                return order === "asc"
                    ? aStr.localeCompare(bStr)
                    : bStr.localeCompare(aStr);
            });
        }

        return result;
    }, [data, searchQuery, activeFilters, sortBy, searchFields]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / perPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilters, sortBy, perPage]);

    const toggleFilter = (filterId: string, value: string) => {
        setActiveFilters((prev) => {
            const current = prev[filterId] || [];
            const newValues = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [filterId]: newValues };
        });
    };

    const clearFilters = () => {
        setActiveFilters({});
        setSearchQuery("");
        setSortBy(defaultSort);
    };

    const activeFilterCount = Object.values(activeFilters).reduce(
        (acc, vals) => acc + vals.length,
        0
    );

    // Default skeleton renderers
    const defaultGridSkeleton = () => (
        <Card>
            <Skeleton className="h-60 w-full rounded-t-lg" />
            <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2 mt-2" />
            </CardHeader>
        </Card>
    );

    const defaultListSkeleton = () => (
        <Card>
            <div className="flex flex-row items-center gap-4 p-4">
                <Skeleton className="w-24 h-36 rounded" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                </div>
            </div>
        </Card>
    );

    const GridSkeleton = renderGridSkeleton || defaultGridSkeleton;
    const ListSkeleton = renderListSkeleton || defaultListSkeleton;

    return (
        <div className="p-4 space-y-4">
            {/* Search and Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9" />
                </div>

                <div className="flex gap-2">
                    {/* Sort */}
                    {sortOptions.length > 0 && (
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by..." />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* Filter Toggle */}
                    {filterOptions.length > 0 && (
                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Filters
                            {activeFilterCount > 0 && (
                                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                    )}

                    {/* View Toggle */}
                    <Button variant="outline" size="icon" onClick={() => setIsGrid(!isGrid)}>
                        {isGrid ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && filterOptions.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Filters</CardTitle>
                            {activeFilterCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    <X className="h-4 w-4 mr-2" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filterOptions.map((filter) => (
                            <div key={filter.id} className="space-y-2">
                                <Label className="text-sm font-medium">{filter.label}</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            <span className="truncate">
                                                {activeFilters[filter.id]?.length > 0
                                                    ? `${activeFilters[filter.id].length} selected`
                                                    : "Select..."}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        {filter.options.map((option) => (
                                            <DropdownMenuCheckboxItem key={option.value} checked={activeFilters[filter.id]?.includes(option.value)}
                                                onCheckedChange={() => toggleFilter(filter.id, option.value)}
                                            >
                                                {option.label}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([filterId, values]) =>
                        values.map((value) => {
                            const filter = filterOptions.find((f) => f.id === filterId);
                            const option = filter?.options.find((o) => o.value === value);
                            
                            return (
                                <Badge key={`${filterId}-${value}`} variant="secondary">
                                    {filter?.label}: {option?.label || value}
                                    
                                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter(filterId, value)} />
                                </Badge>
                            );
                        })
                    )}
                </div>
            )}

            {/* Results Count and Items Per Page */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                    Showing {loading ? "..." : `${(currentPage - 1) * perPage + 1}-${Math.min(currentPage * perPage, filteredData.length)}`} of {loading ? "..." : filteredData.length} results
                </div>
                <div className="flex items-center gap-2">
                    <Label className="text-sm">Items per page:</Label>
                    <Select value={String(perPage)} 
                        onValueChange={(value) => setPerPage(Number(value))}
                    >
                        <SelectTrigger className="w-[80px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {itemsPerPageOptions.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Items List/Grid */}
            <div ref={containerRef}
                className={`overflow-auto ${isGrid
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "flex flex-col gap-4"
                }`}
                style={{ maxHeight: "calc(100vh - 400px)" }}
            >
                {loading ?
                    Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx}>
                            {isGrid ? <GridSkeleton /> : <ListSkeleton />}
                        </div>
                    ))
                : paginatedData.map((item) => (
                    <div key={getItemKey(item)} onClick={() => onItemClick(item)} className="cursor-pointer">
                        {isGrid ? renderGridCard(item) : renderListCard(item)}
                    </div>
                ))}
            </div>

            {/* No Results */}
            {!loading && paginatedData.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No results found</p>
                    {(searchQuery || activeFilterCount > 0) && (
                        <Button variant="link" onClick={clearFilters} className="mt-2">
                            Clear filters and search
                        </Button>
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                                <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} onClick={() => setCurrentPage(pageNum)}>
                                    {pageNum}
                                </Button>
                            );
                        })}
                    </div>
                    <Button variant="outline" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}