import { ModuleBasicData } from "../../dto/ModuleBasicData";
import { ModuleLeader } from "../../dto/ModuleLeader";

export interface ModuleMetadataResponseBody {
    moduleBasicData: ModuleBasicData,
    academicYears: string[],
    leaders: ModuleLeader[],
    numReviews: number
}