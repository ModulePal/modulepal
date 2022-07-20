import React, { useState, useEffect } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container,
    Tooltip,
  } from 'reactstrap';
import { AuthComponent } from './AuthComponent';
import { useContext } from 'react';
import { LoadingComponent } from '../LoadingComponent';
import { AuthContext } from '../../services/firebase/AuthStore';
import logo from '../../img/logo-small-cropped.png'
// import logolarge from '../../img/logo-large-no-warwick.png'
import logogrey from '../../img/logo-small-grey.png'
// import logolargegrey from '../../img/logo-large-grey.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { CurrentUserDataContext } from '../../services/rest/CurrentUserDataStore';
import { UniUserDashboardComponent } from './UniUserDashboardComponent';

const minWidthForUniUserPreview = 320;
const maxWidthForUniUserPreview = 767;

export const NavbarComponent = ({ history }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const [prevScrollpos, setPrevScrollPos] = useState(window.pageYOffset);
    const [visible, setVisible] = useState(true);

    const [logoSelected, setLogoSelected] = useState(false);

    const [width, setWidth] = useState(window.innerWidth);

    function handleWidthChange() {
        setIsOpen(false);
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWidthChange);
        window.addEventListener('onorientationchange', handleWidthChange);
        return () => {window.removeEventListener('resize', handleWidthChange); window.removeEventListener('onorientationchange', handleWidthChange)}
    })

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        const newVisible = prevScrollpos > currentScrollPos;
        setPrevScrollPos(currentScrollPos);
        setVisible(newVisible);
      };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    })


    const authContext = useContext(AuthContext);
    const currentUserDataContext = useContext(CurrentUserDataContext);


    const showAppLinks = authContext.isSignedIn && authContext.user?.emailVerified;

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggleTooltip = () => {
        if (showAppLinks) {
            setTooltipOpen(false);
        }
        else {
            setTooltipOpen(!tooltipOpen);
        }
    }

    if (authContext.pending) {
        return <LoadingComponent />
    }

    const displayUniUserPreview = width >= minWidthForUniUserPreview && width <= maxWidthForUniUserPreview;

    const authComponent = <AuthComponent history={history} displayUniUserPreview={!displayUniUserPreview}></AuthComponent>

    return (
        <React.Fragment>
            <Navbar light expand="md" className="navbar-fix" color="light">
                <Container>
                <NavbarBrand href="/">
                    <Container className="logo-small">
                        {
                            logoSelected ?
                            <img src={logogrey} height="25px" alt="logo-small-grey" className="logo-small" onMouseOut={() => setLogoSelected(false)}></img> :
                            <img src={logo} height="25px" alt="logo-small" className="logo-small" onMouseOver={() => setLogoSelected(true)}></img>
                        }
                        </Container>
                </NavbarBrand>
                {displayUniUserPreview ? 
                    <Nav className="right-align ml-auto" light>
                    <NavItem className="ml-auto">
                    {!!currentUserDataContext.localData.uniUserBasicData ? <div className="pad-right"><UniUserDashboardComponent /></div> : <div></div>}
                    </NavItem>
                    </Nav>
                : null}
                <NavbarToggler onClick={toggle} />
                {!isOpen ? <React.Fragment>
                    <Collapse isOpen={isOpen} navbar className="bg-light">
                    <Nav className="mr-auto" navbar light>
                    <NavItem id="modules">
                    <NavLink href="/reviews/">Reviews</NavLink>
                    {/* <NavLink href="/reviews/" disabled={!showAppLinks}>Reviews <span hidden={showAppLinks}><FontAwesomeIcon icon={faLock} size="sm" /></span></NavLink> */}
                    </NavItem>
                    {/* <Tooltip
                        isOpen={tooltipOpen}
                        target={"modules"}
                        toggle={toggleTooltip}
                    >
                        Please log in and verify your email to access reviews.
                    </Tooltip> */}
                    <NavItem>
                    <NavLink href="/preview/">Preview</NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink href="/about/">About</NavLink>
                    </NavItem>
                    </Nav>
                    <Nav className="ml-auto" navbar light>
                        {authComponent}
                    </Nav>
                    </Collapse>
                    </React.Fragment> : null}
                </Container>
            </Navbar>
            <Collapse isOpen={isOpen} light navbar className="bg-light">
                <Container>
                <Nav className="ml-auto" navbar light>
                    {/* <div className="mt-5"></div> */}
                    <div className="mt-3"></div>
                </Nav>
                <Nav className="mr-auto" light navbar>
                    <NavItem id="modules"color="light">
                    <NavLink href="/reviews/">Reviews</NavLink>
                    <NavItem>
                    <NavLink href="/preview/">Preview</NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink href="/about/">About</NavLink>
                    </NavItem>
                    {/* <NavLink href="/reviews/" disabled={!showAppLinks}>Reviews</NavLink> */}
                    </NavItem>
                    {/* <Tooltip
                        isOpen={tooltipOpen}
                        target={"modules"}
                        toggle={toggleTooltip}
                    >
                        Please log in and verify your email to access reviews.
                    </Tooltip> */}
                </Nav>
                <Nav className="ml-auto" navbar light>
                    {authComponent}
                </Nav>
                <Nav className="ml-auto" navbar light>
                    <div className="mt-3"></div>
                </Nav>
                </Container>
             </Collapse>
            
      </React.Fragment>
    );
  }