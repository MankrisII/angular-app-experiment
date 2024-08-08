export interface HousingLocation {
    id?: string,
    name: string,
    city: string,
    state: string,
    photos: string[],
    availableUnits: number,
    wifi: boolean,
    laundry: boolean
}