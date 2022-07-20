import React from "react";
import { BannerComponent } from "./BannerComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown, IconDefinition } from '@fortawesome/free-regular-svg-icons'

export interface TitleBannerComponentProps {
    titleString: string;
    titleIcon: IconDefinition | null;
    history: any;
}

export const TitleBannerComponent: React.FC<TitleBannerComponentProps> = ({ titleString, history, titleIcon }) => {
    return (
        <BannerComponent page={titleString} history={history}>
            <h1 className="display-4"><FontAwesomeIcon icon={!titleIcon ? faArrowAltCircleDown : titleIcon} size="sm" /> {titleString}</h1>
        </BannerComponent>
    );
}