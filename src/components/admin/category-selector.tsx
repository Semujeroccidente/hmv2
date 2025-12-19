"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge";

export interface CategoryResult {
    id: string;
    name: string;
    slug: string;
    level: number;
    parent?: { name: string };
    _count?: { products: number };
}

interface CategorySelectorProps {
    onSelect: (categories: CategoryResult[]) => void;
    maxSelection?: number;
    selectedIds?: string[];
}

export function CategorySelector({ onSelect, maxSelection = 3, selectedIds = [] }: CategorySelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<CategoryResult[]>([])
    const [loading, setLoading] = React.useState(false)
    const [selectedCategories, setSelectedCategories] = React.useState<CategoryResult[]>([])

    // Load selected categories on mount if IDs provided
    // (In a real app, you'd fetch them by ID, here we assume consumer passes full objects if possible, 
    // or we fetch. For simplicity, we just handle search-based selection for now)

    const [allCategories, setAllCategories] = React.useState<CategoryResult[]>([])

    // Load available categories on mount
    React.useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            try {
                // Fetch all categories
                const res = await fetch('/api/categories')
                if (res.ok) {
                    const data = await res.json()
                    // API returns { categories: [...] }
                    const cats = data.categories || data || []
                    setAllCategories(cats)
                    setResults(cats) // Initial results
                }
            } catch (e) {
                console.error("Failed to load categories", e)
            } finally {
                setLoading(false)
            }
        }
        fetchCategories()
    }, [])

    // Filter locally when query changes
    React.useEffect(() => {
        if (!query) {
            setResults(allCategories)
            return
        }

        const lowerQuery = query.toLowerCase()
        const filtered = allCategories.filter(cat =>
            cat.name.toLowerCase().includes(lowerQuery) ||
            (cat.parent?.name && cat.parent.name.toLowerCase().includes(lowerQuery))
        )
        setResults(filtered)
    }, [query, allCategories])

    const handleSelect = (category: CategoryResult) => {
        if (selectedCategories.some(c => c.id === category.id)) {
            const newSelection = selectedCategories.filter(c => c.id !== category.id);
            setSelectedCategories(newSelection);
            onSelect(newSelection);
        } else {
            if (selectedCategories.length < maxSelection) {
                const newSelection = [...selectedCategories, category];
                setSelectedCategories(newSelection);
                onSelect(newSelection);
            }
        }
        setOpen(false); // Close on select? Maybe keep open for multi? 
        // User style: Keep open or close. Let's keep open for easier multi.
    };

    const removeCategory = (id: string) => {
        const newSelection = selectedCategories.filter(c => c.id !== id);
        setSelectedCategories(newSelection);
        onSelect(newSelection);
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map(cat => (
                    <Badge key={cat.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {cat.name} <span className="text-xs opacity-50">({cat.level === 1 ? 'Root' : `L${cat.level}`})</span>
                        <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 rounded-full p-0" onClick={() => removeCategory(cat.id)}>
                            <div className="h-3 w-3">x</div>
                        </Button>
                    </Badge>
                ))}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedCategories.length > 0 ? "Agregar otra categoría..." : "Buscar categoría..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput placeholder="Buscar categoría ej: Smartphones..." value={query} onValueChange={setQuery} />
                        <CommandList>
                            {loading && <CommandItem disabled>Cargando...</CommandItem>}
                            {!loading && query.length > 1 && results.length === 0 && (
                                <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                            )}
                            {!loading && query.length <= 1 && results.length === 0 && (
                                <div className="p-4 text-sm text-center text-muted-foreground">Escribe para buscar...</div>
                            )}
                            <CommandGroup heading="Resultados">
                                {results.map((category) => (
                                    <CommandItem
                                        key={category.id}
                                        value={category.id}
                                        onSelect={() => handleSelect(category)}
                                        className="flex flex-col items-start cursor-pointer"
                                    >
                                        <div className="flex items-center w-full">
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCategories.some(c => c.id === category.id) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{category.name}</div>
                                                {category.parent && (
                                                    <div className="text-xs text-muted-foreground">en {category.parent.name}</div>
                                                )}
                                            </div>
                                            {category.level && <Badge variant="outline" className="text-[10px] h-5">N{category.level}</Badge>}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
