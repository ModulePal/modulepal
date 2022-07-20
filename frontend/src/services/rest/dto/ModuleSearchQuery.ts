export interface ModuleSearchQuery {
    moduleName: String | null,
    departmentCode: String | null,
    pageNumber: number,
    pageSize: number,
    sortAsc: boolean | null
}