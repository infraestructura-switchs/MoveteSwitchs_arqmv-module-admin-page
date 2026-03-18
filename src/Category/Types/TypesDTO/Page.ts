import { sortDto } from "./Sort";

export interface PageDto{
    page: number,
    size: number,
    sort: sortDto,
    unpaged: boolean,
    totalElements: number,

}