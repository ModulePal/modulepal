import React, { useContext } from 'react';
import { Progress } from 'reactstrap';
import { CurrentUserDataContext } from '../../services/rest/CurrentUserDataStore';
import { UniUserBasicData } from '../../services/rest/dto/UniUserBasicData';

export interface ProfileCompletionBarProps {
    guest: boolean
    emailVerified: boolean,
    tabulaMemberVerified: boolean,
    loadingUniUserData: boolean
}

export const ProfileCompletionBarComponent: React.FC<ProfileCompletionBarProps> = barProps => {
    var barValue = barProps.guest ? 50 : 10;
    var text = barProps.guest ? "Student status not verified" : "Email and student status not verified!"
    var color = "danger";

    if ((barProps.guest || barProps.emailVerified) && barProps.tabulaMemberVerified) {
        barValue = 100;
        text = "Account all set up!"
        color="success";
    }
    else if (barProps.loadingUniUserData) {
        barValue = 80;
            text = "Loading your student data...";
            color="info";
    }
    else {
        if (barProps.guest || barProps.emailVerified) {
            if (barProps.guest) {
                barValue = 50;
                text = "Student status not verified!"
                color = "danger";
            }
            else {
                barValue = 65;
                text = "Email verfied, student status not verified!"
                color = "warning";
            }
        }
        if (barProps.tabulaMemberVerified) {
            // somehow verified even though !(guest || emailVerified) is true => !guest && !emailVerified
            barValue = 10;
            text = "ERROR: Student status verified, email not verified. Please report this as a bug if you see it.";
            color = "danger";
        }
    }

  return (
    <div>
        <div className="text-center">{text}</div>
        <Progress animated value={barValue} color={color}></Progress>
    </div>
  );
};