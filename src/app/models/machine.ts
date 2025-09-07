export interface Machine {
    available_charging_slots: number,
    bin_level: number,
    charging_slots: number,
    last_modified: Date,
    name: string
    status: boolean
}