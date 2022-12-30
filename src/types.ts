export type Media = {
    disname: string
    status: string
    category: string
    seasons: {[key: string]: MediaSeason}
}

export type MediaSeason = {
    disname: string
    studio: string
    rating: number
    notes: string
}

export let Categories = ["series", "movie", "book", "podcast"]
export let Status = ["planned", "watching", "completed", "paused", "dropped"]