import React, { useState } from 'react';
import './App.css';
import "react-toggle/style.css"
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MainPageComponent } from './components/main-page/MainPageComponent';
import { LoginPageComponent } from './components/login-page/LoginPageComponent';
import { SignupPageComponent } from './components/signup-page/SignupPageComponent';
import { AuthProvider, AuthContext } from './services/firebase/AuthStore';
import { ReviewsPageComponent } from './components/reviews-page/ReviewsPageComponent';
import { SettingsComponent } from './components/settings-page/SettingsComponent';
import { SettingsPageComponent } from './components/settings-page/SettingsPageComponent';
import { AboutPageComponent } from './components/about-page/AboutPageComponent';
import { CurrentUserDataProvider } from './services/rest/CurrentUserDataStore';
import { ModulePageComponent } from './components/module/ModulePageComponent';
import { EmailVerifiedPageComponent } from './components/email-verified-page/EmailVerifiedPageComponent';

import { ModuleProvider } from './components/module/context/ModuleContext';
import { CookiesPolicyPageComponent } from './components/legal/CookiesPolicyPageComponent';
import { PrivacyPolicyPageComponent } from './components/legal/PrivacyPolicyPageComponent';
import { LegalComponent } from './components/legal/LegalComponent';
import { LegalPageComponent } from './components/legal/LegalPageComponent';
import { SelectedDepartmentProvider } from './components/context/SelectedDepartmentContext';
import { SelectedModuleProvider } from './components/context/SelectedModuleContext';
import { PreviewPageComponent } from './components/preview-page/PreviewPageComponent';

function App() {
  function hashLinkScroll() {
    const { hash } = window.location;
    if (hash !== '') {
      // Push onto callback queue so it runs after the DOM is updated,
      // this is required when navigating from a different page so that
      // the element is rendered on the page before trying to getElementById.
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView();
      }, 0);
    }
  }

  return (
    <CurrentUserDataProvider>
      <AuthProvider>
  
    <SelectedDepartmentProvider>
    <SelectedModuleProvider>
    <ModuleProvider>
    
    
        <Router>
          <div>
            <Route exact path = "/" component={MainPageComponent} />
            <Route exact path="/login" component={LoginPageComponent} />
            {/* <Route exact path="/signup" component={SignupPageComponent} /> */}
            <Route exact path="/reviews" component={ReviewsPageComponent} />
            <Route exact path="/settings" component={SettingsPageComponent} />
            <Route exact path="/emailVerified" component={EmailVerifiedPageComponent} />
            <Route exact path="/cookies" component={CookiesPolicyPageComponent} />
            <Route exact path="/privacy" component={PrivacyPolicyPageComponent} />
            <Route exact path="/legal" component={LegalPageComponent} />
            <Route exact path="/about" component={AboutPageComponent} />
            <Route exact path="/preview" component={PreviewPageComponent} />
            
              <Route exact path="/module/:moduleCode" component={ModulePageComponent} />
            
          </div>
        </Router>
        </ModuleProvider>
    </SelectedModuleProvider>
    </SelectedDepartmentProvider>
    
    </AuthProvider>
    </CurrentUserDataProvider>
  );
}

export default App;
