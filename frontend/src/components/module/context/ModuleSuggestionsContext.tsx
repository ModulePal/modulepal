import React, { useState, useContext, useEffect } from "react";
import { generateTextualContext, generateTextualProvider, TextualDisplayStrings } from "./ModuleTextualContext";

export const ModuleSuggestionsContext = generateTextualContext();
export const ModuleSuggestionsProvider = generateTextualProvider(ModuleSuggestionsContext, "SUGGESTION");

export const ModuleSuggestionsDisplayStrings: TextualDisplayStrings = {
    singular: "suggestion",
    plural: "suggestions",
    pastAction: "suggested",
    futureAction: "suggest",
    progressiveAction: "suggesting"
};