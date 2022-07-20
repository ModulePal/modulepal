import React, { useState, useEffect, useContext } from "react";
import { ModuleContext } from "./ModuleContext";
import { ModuleMetadataContext } from "./ModuleMetadataContext";
import { ModuleMyAcademicDataContext } from "./ModuleMyAcademicDataContext";

interface BulkAddReviewsDataFunctional {
    bulkAddReview: boolean,
    updateBulkAddReview: (value: boolean) => void
}

export const BulkAddReviewsContext = React.createContext<BulkAddReviewsDataFunctional>({
    bulkAddReview: false,
    updateBulkAddReview: () => {}
});

export const BulkAddReviewsProvider = ({ children }) => {
    const [bulkAddReview, setBulkAddReview] = useState(false);
    const moduleContext = useContext(ModuleContext);
    const academicYearContext = useContext(ModuleMetadataContext);
    const academicDataContext = useContext(ModuleMyAcademicDataContext);

    useEffect(() => {
        setBulkAddReview(false);
    }, [moduleContext, academicYearContext, academicDataContext])

    return (
        <BulkAddReviewsContext.Provider value={{bulkAddReview: bulkAddReview, updateBulkAddReview: value => setBulkAddReview(value)}}>
            {children}
        </BulkAddReviewsContext.Provider>
    );
}