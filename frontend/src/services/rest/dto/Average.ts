export interface Average {
    value: number,
    sampleSize: number,
    valueFrequencies: Record<number, number>
}