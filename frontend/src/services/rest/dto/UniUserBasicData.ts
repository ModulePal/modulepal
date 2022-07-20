import { DepartmentBasicData } from "./DepartmentBasicData";

export interface UniUserBasicData {
    uniId: string,
    firstName: string,
    lastName: string,
    email: string,
    department: DepartmentBasicData,
    gotModuleData: boolean,
    anonymous: boolean
}