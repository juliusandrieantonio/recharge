export interface RecyclingFacilityInfo {
    uid: string,
    facility_name: string,
    phone_number: string,
    status: boolean,
    total_bottles_collected: number,
    role: string
}

export interface RecyclingFacilityHistory {
    id: string,
    facility_name: string,
    requested_bottles: number,
    actual_bottles: number | null,
    requested_date: string,
    status: boolean
}