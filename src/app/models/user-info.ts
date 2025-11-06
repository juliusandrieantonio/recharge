export interface UserInfo {
    email: string,
    phone_number: string,
    role: string,
    status: boolean,
    bottles?: number,
    total_bottles_collected?: number
}