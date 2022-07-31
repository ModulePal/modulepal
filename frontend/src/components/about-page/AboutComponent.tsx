import React from "react"
import { AboutSetUpComponent } from "./AboutSetUpComponent"
import { Row, Col, Card, CardTitle, CardText, Container } from "reactstrap";

export const AboutComponent = () => {
    return (
        <React.Fragment>
            <Container>
        <h2>What is ModulePal?</h2>
        <p>ModulePal is an app which enables students at the University of Warwick to review modules they have taken, to inform and ultimately help students and staff make better decisions. We provide legitimate and informative statistics, by linking to students' University of Warwick accounts and harnessing that data effectively and <a href="/privacy#warwick" target="_blank">confidentially</a>.</p>
        <p>ModulePal is an app created by and for students. So, whether you had a particularly good or bad experience with a module - or just want to help out your fellow peers and staff - sharing your reviews helps support both your peers and the running of the app! We hope that over time, ModulePal will become a vast collection of knowledge and experiences, providing useful insights for both students and staff.</p>
        <br />

        <h2>I want to post reviews! How can I do that?</h2>

        <p>Just <a href="/login">log in</a> via your University of Warwick Student account. Click 'Log in as a student', and follow the instructions from there. Once finished on the Warwick website, you will be redirected to ModulePal where the authentication process will be completed, and you can start making reviews!</p>
        <p>If you logged in previously, and now when you log in your modules aren't up to date, go to <a href="/settings">Settings</a> and click 'Update my student data' to update your student data in ModulePal.</p>

            <br/>
            <br/>
            <h2>Why we ask you to link your University Student Account</h2>
            <p><i>Please note that you are not required to link your University Student account to read reviews.</i></p>
            <p>In order to <b>add</b> reviews, we ask you to link your student account for the following reasons:
            <ul>
              <li>We check that your are eligible to add a review for a module. Only students who have completed a module (i.e. have a final grade for it) are able to add a review, in order to maintain the integrity and legitimacy of reviews on this site.</li>
              <li>We require some contextual data of your studies to provide better review statistics. For metric ratings, this data in anonymised by default. For comments and suggestions, they can be anonymised via <a href="/settings" target="_blank">Settings</a>. <b>If anonymous, you won't be personally identifiable from your reviews, in any case.</b></li>
            </ul>
            </p>
            <p>Check out the <a href="/privacy#warwick" target="_blank">Warwick section of our Privacy Policy</a> for more detailed information on how we use your data.</p>
            <br/>
            <h2>Can I unlink my University Student Account?</h2>
            <p>Yes. Go to <a href="/settings" target="_blank">Settings</a>, where you will be able to click 'Unlink my student account'.</p>
            <p>Note that if you do this, any previous reviews that you have made will be hidden from module statistics, but are recoverable if you link your account again.</p>
            <p>All data pertaining to your University of Warwick Student account will be deleted from our database after you Unlink your Student Account or Delete your account from ModulePal.
            </p>
            <br />
            <h2>Contributions</h2>
            <p>ModulePal is open-source and open to contributions from kind collaborators on GitHub: <a href="https://github.com/ModulePal/modulepal" target="_blank">https://github.com/ModulePal/modulepal</a>.</p>
            <br />
            <h2>Contact</h2>
            <p>Email: <a href="mailto:omrtnnr@gmail.com">omrtnnr@gmail.com</a><br/>
            </p>
            </Container>
        </React.Fragment>
    );
}