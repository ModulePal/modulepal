import React, { useEffect } from "react";
import { Container, Row, Button } from "reactstrap";

export const CookiesPolicyComponent = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://consent.cookiebot.com/49a5d91d-0461-4d2b-b9e7-ae14ca75cd07/cd.js";
        script.async = false;
        script.id = 'CookieDeclaration';
        script.type = "text/javascript";
        document.getElementsByTagName('body')[0].appendChild(script);
      }, []);

      return (
        <div dangerouslySetInnerHTML={{__html: "<script id='CookieDeclaration' src='https://consent.cookiebot.com/49a5d91d-0461-4d2b-b9e7-ae14ca75cd07/cd.js' type='text/javascript' async></script>"}} />
      );
      
    return (
        
        <Row>
        <Container>
        {/* <script id="" src="" type="text/javascript" async></script> */}
        {/* <Button className="termly-cookie-preference-button" type="button" onClick={() => window["displayPreferenceModal"]()}>Manage Cookie Preferences</Button> */}
        </Container>
        </Row>
    )
}