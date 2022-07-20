import React, { useState, useContext, useEffect } from "react";
import { generateTextualContext, generateTextualProvider, TextualDisplayStrings } from "./ModuleTextualContext";

export const ModuleCommentsContext = generateTextualContext();
export const ModuleCommentsProvider = generateTextualProvider(ModuleCommentsContext, "COMMENT");

export const ModuleCommentsDisplayStrings: TextualDisplayStrings = {
    singular: "comment",
    plural: "comments",
    pastAction: "commented",
    futureAction: "comment",
    progressiveAction: "commenting"
};