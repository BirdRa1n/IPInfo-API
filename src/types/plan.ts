export interface PLAN {
    id: number;
    name: string;
    price: number;
    maxRequests: number;
    maxRequestsPerDay: number;
    maxRequestsPerMonth: number;
    maxRequestsPerYear: number;
}