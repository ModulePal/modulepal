export interface DepartmentSearchQuery {
    departmentName: String | null,
    departmentCode: String | null,
    pageNumber: number,
    pageSize: number,
    sortAsc: boolean | null
}