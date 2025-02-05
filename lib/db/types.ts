export interface ShowSlim {
  id: number;
  title: string;
  poster?: string;
  exactMatch?: boolean;
  releaseYear: number | null | undefined;
  imdbScore: number | null | undefined;
}
