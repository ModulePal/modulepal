import React, { useContext, useEffect } from "react";
import AnchorLink from 'react-anchor-link-smooth-scroll'
import { Alert, Container } from "reactstrap";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PrivacyPolicyComponent = ({ history }) => {
    useEffect(() => {
        const hash = history.location.hash
        setTimeout(() => {
            if (hash && document.getElementById(hash.substr(1))) {
                // Check if there is a hash and if an element with that id exists
                document.getElementById(hash.substr(1))?.scrollIntoView({behavior: "smooth"});
            }
        }, 1000);
        
    }, [history.location.hash]) // Fires every time hash changes

    return (
        <React.Fragment>
            <Container>
            <Alert color="info" className="mb-5 text-center"><span><FontAwesomeIcon icon={faInfoCircle} size="sm" /> &nbsp;Interested in the privacy of your Warwick Student Data? <a href="/privacy#warwick">Click here.</a></span></Alert>
            
<p><h1>Privacy Policy</h1></p>
<p>Last updated: <strong>31 July 2022</strong>.</p>
<p>This Application collects some Personal Data from its Users.</p>
<p>This document can be printed for reference by using the print command in the settings of any browser.</p>
<p><br></br><h2>Owner and Data Controller</h2></p>
<p>Omar Tanner PSC Ltd (England, United Kingdom) (owner of 'ModulePal')</p>
<p><strong>Owner contact email:</strong>&nbsp;<a href="mailto:omrtnnr@gmail.com">omrtnnr@gmail.com</a></p>
<p><br></br><h2>Types of Data collected</h2></p>
<p>Among the types of Personal Data that this Application collects, by itself or through third parties, there are: email addresses; user agents; IP addresses; University of Warwick Student Data.</p>
<p>Complete details on each type of Personal Data collected are provided in the dedicated sections of this privacy policy or by specific explanation texts displayed prior to the Data collection.<br /> Personal Data may be freely provided by the User, or, in case of Usage Data, collected automatically when using this Application.<br /> Unless specified otherwise, all Data requested by this Application is mandatory and failure to provide this Data may make it impossible for this Application to provide its services. In cases where this Application specifically states that some Data is not mandatory, Users are free not to communicate this Data without consequences to the availability or the functioning of the Service.<br /> Users who are uncertain about which Personal Data is mandatory are welcome to contact the Owner.<br /> Any use of Cookies &ndash; or of other tracking tools &ndash; by this Application or by the owners of third-party services used by this Application serves the purpose of providing the Service required by the User, in addition to any other purposes described in the present document and in the Cookie Policy, if available.</p>
<p>Users are responsible for any third-party Personal Data obtained, published or shared through this Application and confirm that they have the third party's consent to provide the Data to the Owner.</p>
<p><br></br><h2>Mode and place of processing the Data</h2></p>
<p><h3>Methods of processing</h3></p>
<p>The Owner takes appropriate security measures to prevent unauthorized access, disclosure, modification, or unauthorized destruction of the Data.<br /> The Data processing is carried out using computers and/or IT enabled tools, following organizational procedures and modes strictly related to the purpos&shy;es indicated. In addition to the Owner, in some cases, the Data may be accessible to certain types of persons in charge, involved with the operation of this Application (administration, sales, marketing, legal, system administration) or external parties (such as third-party technical service providers, mail carriers, hosting providers, IT companies, communications agencies) appointed, if necessary, as Data Processors by the Owner. The updated list of these parties may be requested from the Owner at any time.</p>
<p><h3>Legal basis of processing</h3></p>
<p>The Owner may process Personal Data relating to Users if one of the following applies:</p>
<ul>
<li>Users have given their consent for one or more specific purposes. Note: Under some legislations the Owner may be allowed to process Personal Data until the User objects to such processing (&ldquo;opt-out&rdquo;), without having to rely on consent or any other of the following legal bases. This, however, does not apply, whenever the processing of Personal Data is subject to European data protection law;</li>
<li>provision of Data is necessary for the performance of an agreement with the User and/or for any pre-contractual obligations thereof;</li>
<li>processing is necessary for compliance with a legal obligation to which the Owner is subject;</li>
<li>processing is related to a task that is carried out in the public interest or in the exercise of official authority vested in the Owner;</li>
<li>processing is necessary for the purposes of the legitimate interests pursued by the Owner or by a third party.</li>
</ul>
<p>In any case, the Owner will gladly help to clarify the specific legal basis that applies to the processing, and in particular whether the provision of Personal Data is a statutory or contractual requirement, or a requirement necessary to enter into a contract.</p>
<p><h3>Place</h3></p>
<p>The Data is processed at the Owner's operating offices and in any other places where the parties involved in the processing are located.<br /><br /> Depending on the User's location, data transfers may involve transferring the User's Data to a country other than their own. To find out more about the place of processing of such transferred Data, Users can check the section containing details about the processing of Personal Data.</p>
<p>Users are also entitled to learn about the legal basis of Data transfers to a country outside the European Union or to any international organization governed by public international law or set up by two or more countries, such as the UN, and about the security measures taken by the Owner to safeguard their Data.<br /><br /> If any such transfer takes place, Users can find out more by checking the relevant sections of this document or inquire with the Owner using the information provided in the contact section.</p>
<p><h3>Retention time</h3></p>
<p>Personal Data shall be processed and stored for as long as required by the purpose they have been collected for.</p>
<p>Therefore:</p>
<ul>
<li>Personal Data collected for purposes related to the performance of a contract between the Owner and the User shall be retained until such contract has been fully performed.</li>
<li>Personal Data collected for the purposes of the Owner&rsquo;s legitimate interests shall be retained as long as needed to fulfil such purposes. Users may find specific information regarding the legitimate interests pursued by the Owner within the relevant sections of this document or by contacting the Owner.</li>
</ul>
<p>The Owner may be allowed to retain Personal Data for a longer period whenever the User has given consent to such processing, as long as such consent is not withdrawn. Furthermore, the Owner may be obliged to retain Personal Data for a longer period whenever required to do so for the performance of a legal obligation or upon order of an authority.<br /><br /> Once the retention period expires, Personal Data shall be deleted. Therefore, the right to access, the right to erasure, the right to rectification and the right to data portability cannot be enforced after expiration of the retention period.</p>
<p><h3>The purposes of processing</h3></p>
<p>The Data concerning the User is collected to allow the Owner to provide its Service, comply with its legal obligations, respond to enforcement requests, protect its rights and interests (or those of its Users or third parties), detect any malicious or fraudulent activity, as well as the following: Registration and authentication.</p>
<p>For specific information about the Personal Data used for each purpose, the User may refer to the section &ldquo;Detailed information on the processing of Personal Data&rdquo;.</p>
<p><h3>Detailed information on the processing of Personal Data</h3>By registering or authenticating, Users allow this Application to identify them and give them access to dedicated services.<br /> Depending on what is described below, third parties may provide registration and authentication services. In this case, this Application will be able to access some Data, stored by these third-party services, for registration or identification purposes.<br /> Some of the services listed below may also collect Personal Data for targeting and profiling purposes; to find out more, please refer to the description of each service.</p>
<p>Personal Data is collected for the following purposes and using the following services:</p>
<h4>Firebase Hosting (Google LLC)</h4>
<p>Firebase Hosting is a fast and secure hosting provider, provided by Google LLC. Firebase Hosting uses IP addresses of incoming requests to detect abuse and provide customers with detailed analysis of usage data.</p>
<p>Personal Data processed: IP addresses.</p>
<p>Place of processing: United States &ndash;&nbsp;<a href="https://policies.google.com/privacy">Privacy Policy</a>. Privacy Shield participant.</p>
<h4>Firebase Authentication (Google LLC)</h4>
<p>Firebase Authentication is a registration and authentication service provided by Google LLC. To simplify the registration and authentication process, Firebase Authentication can make use of third-party identity providers and save the information on its platform.</p>
<p>Personal Data processed: user agents; IP addresses.</p>
<p>Place of processing: United States &ndash;&nbsp;<a href="https://policies.google.com/privacy">Privacy Policy</a>. Privacy Shield participant.</p>
<h4>Firebase Realtime Database (Google LLC)</h4>
<p>Firebase Realtime Database is a cloud-hosted database, provided by Google LLC. Firebase Realtime Database uses IP addresses and user agents to enable the profiler tool, which helps Firebase customers (the Owner) understand usage trends and platform breakdowns.</p>
<p>Personal Data processed: IP addresses, user agents, University of Warwick Student Data. </p>
<p>Place of processing: Europe &ndash;&nbsp;<a href="https://policies.google.com/privacy">Privacy Policy</a>. Privacy Shield participant.</p>
<h4>DigitalOcean Droplet (DigitalOcean LLC)</h4>
<p>DigitalOcean Droplet is a cloud-hosted virtual machine, provided by DigitalOcean LLC. DigitalOcean Droplet hosts the Application&rsquo;s back-end services, as well as some databases and web servers, and is the recipient of Users&rsquo; requests made automatically from their browser while using the Application. DigitalOcean Droplet is secure, by using methods such as but not limited to: requiring authentication to access services that directly interface with Personal Data, <a href="https://en.wikipedia.org/wiki/OAuth" target="_blank">OAuth1.0</a> and <a href="https://oauth.net/2/" target="_blank">OAuth2.0</a> technologies, transmitting data via HTTPS, encrypting Personal Data. Digital Ocean Droplet uses all (but not necessarily only) the other services listed in this section.</p>
<p>Personal Data processed: Email addresses, user agents, IP addresses, University of Warwick Student Data (Students&rsquo;: University ID, Department, University Email, First Name, Last Name, Route / Course of Study, Modules Taken, Academic Years for Modules Taken, Marks for Modules Taken, Classification for Modules Taken).</p>
<p>Place of processing: United Kingdom &ndash;&nbsp;<a href="https://www.digitalocean.com/legal/privacy-policy/">Privacy Policy</a>. Privacy Shield participant.</p>
<section id="warwick">
<h4>University of Warwick Tabula API (University of Warwick)</h4>
<p>University of Warwick <a href="https://warwick.ac.uk/services/its/servicessupport/web/tabula/api/" target="_blank">Tabula API</a> is a <a href="https://en.wikipedia.org/wiki/Representational_state_transfer" target="_blank">REST API</a> used by the Application to obtain Data pertaining to University of Warwick&rsquo;s: Departments, Modules, Routes (Courses of Study) and Students; and Personal Data pertaining to University of Warwick&rsquo;s: Students. All Data obtained from the Tabula API is used in good faith with a granted and terminatable access key distributed from the University of Warwick, and only to provide the core services of the Application, i.e. any service targeted for Users that is publicly accessible via the Application, with an account or otherwise.<br /> Personal Data processed pertaining to Students (with reference to the University of Warwick's Tabula API) consists of their: University ID, Department, University Email, First Name, Last Name, Route / Course of Study, Modules Taken, Academic Years for Modules Taken, Marks for Modules Taken, Classification for Modules Taken. <br /> Although not requested or processed (and the Owner does not legally have permission to do so unless Users are reasonably informed), the Application can also download any information the User can access while logged in to Tabula with their University account, and the data found at <a href="https://warwick.ac.uk/services/its/servicessupport/web/sign-on/development/reference/attributes/" target="_blank">https://warwick.ac.uk/services/its/servicessupport/web/sign-on/development/reference/attributes/</a>. A Student&rsquo;s Personal Data is ONLY obtained if they granted the Application permission, which is ONLY in the event that the User wishes to link their University of Warwick Student Account, or update their University of Warwick Student Data. In either event, the Application uses the <a href="https://en.wikipedia.org/wiki/OAuth" target="_blank">OAuth protocol</a> to allow the User to verify their identity on Warwick&rsquo;s domain, and grant the Owner permission to download their <a href="https://warwick.ac.uk/services/its/servicessupport/web/tabula/api/member/member-object" target="_blank">Member object</a> from the Tabula API, containing the Personal Data pertaining to Students as above. The Application does not specifically request or use other data, and only uses the access key obtained via OAuth from the Tabula API ONCE, after which it is permanently destroyed. This means that the Application can only download the <a href="https://warwick.ac.uk/services/its/servicessupport/web/tabula/api/member/member-object" target="_blank">Member object</a> of a Student ONCE PER REQUEST to link their University of Warwick Student Account or update their University of Warwick Student Data, and the Application will store the Personal Data pertaining to the Student in a database indefinitely until either they unlink their University of Warwick Student Account or delete their account on the Application, after which the Personal Data pertaining the Student is permanently destroyed. A user can revoke ModulePal's OAuth access token to their account (even though it is not stored for longer than one week) by visiting <a href="https://websignon.warwick.ac.uk/oauth/tokens" target="_blank">https://websignon.warwick.ac.uk/oauth/tokens</a>.</p>
<p>Personal Data processed: University of Warwick Student Data (Students&rsquo;: University ID, Department, University Email, First Name, Last Name, Route / Course of Study, Modules Taken, Academic Years for Modules Taken, Marks for Modules Taken, Classification for Modules Taken).</p>
<p><strong>What the Application does NOT do with this Personal Data:<br /></strong>The Owner or the Application does NOT do the following with this Personal Data:</p>
<ul>
<li>Share or sell it with anyone but the User that linked the corresponding University Account and the other services listed above. The Data may be shared with the other services above only for storage, transportation and relaying purposes.</li>
<li>Use it to &ldquo;spy&rdquo; on, impersonate, or extract information about, the Users of the Application. The Data is only to be used to provide the automated public services of the Application, and is not manually accessed or analysed for any other purpose, except ensuring no data loss and integrity through means such as backups, fixing bugs, and testing. If such Data is to be accessed manually, and may be in the viewing of the Owner, the Owner will notify any related User via email, explaining why the Data has to be accessed, and requesting permission to do so. If within one month, the User does not deny the request, the Owner is assumed permission to manually access the Data. If the request is denied, the initial purpose to access the Data may not be fulfilled, which may mean that bugs will persist, or other issues shall remain. <br/>Any manual accesses of Personal Data are done in the utmost respect to the privacy of the Users of this Application. Users&rsquo; Data, in its undecrypted form, is obfuscated in Base64 format, making its viewing require additional effort. Unless the process puts your Personal Data in clear viewing of the Owner, the Owner has full permission to add/update/delete the Data &ndash; in batch or otherwise - unless a User is subjected to impersonation, deliberate or otherwise.</li>
<li>Use the Data as a means of leverage or threat.<strong><br /><br /></strong></li>
</ul>
<p><br /><strong>Why and what the Application does with this Personal Data:<br /></strong>- In short: The Application needs your Personal Data to provide legitimacy, quality and context for the Reviews in the Application. With your Personal Data, the Application can personalise the Application to your University of Warwick Identity, and provide greater analytics. Any manual accesses to your Personal Data that may be in the viewing of the Owner will require your permission, and all accesses to your Personal Data are done with the utmost respect to your privacy.<strong><br /><br /></strong>The application uses the above Personal Data to: uniquely identify Users, provide Users&rsquo; public identity on the Application, customise the Application to Users&rsquo; University of Warwick identity, try to prevent illegitimate or misleading Reviews for Modules, contextualise Reviews for Modules.<br /><br /><strong>Uniquely identify Users</strong><br /> The University ID is used to uniquely identify Users.<br /><br /><strong>Provide Users&rsquo; public identity</strong><br /> The First Name, Last Name, Department, Academic Years for Modules Taken and Classification for Modules Taken are used to provide Users&rsquo; public identity on the application. Specifically, when a User posts a Comment or Suggestion on a Module in an Academic Year and is not anonymous, their First Name, Last Name and Department is shown publicly as the identity of the Commenter or Suggester (the User), as well as the Classification they achieved in the Module on the Academic Year, extracted from the Classification for Modules Taken. Also, when a User adds their value to a Metric, no Personal Data is shown in the Pie Chart, however in the Heat Map with Grade on the y-axis and value on the x-axis, their Classification in the Module in the Academic Year as well as the value they rated the specific Metric is used include their rating in the corresponding aggregate value. The User is included in this aggregate value whether or not they are anonymous, however the User is not personally identifiable by such inclusion, since one can only deduce only their Classification in the Module in the Academic Year and the value they chose. Their Classification in the Module in the Academic Year is extracted from their Classification for Modules Taken and Academic Years for Modules Taken. If a User is anonymous, their First Name, Last Name and Department are not shown publicly in the identity of the Commenter or Suggester (the User), however the Classification they achieved in the Module on the Academic Year is shown, but the User is not personally identifiable by such inclusion since one can only deduce the Classification they achieved in the Module on the Academic Year from such Data.<br /><br /><strong>Customise the Application to Users&rsquo; University of Warwick identity<br /></strong>The University ID, First Name, Last Name, University Email, Department, Route / Course of Study are used to show a preview of the currently linked University of Warwick Student Account for the logged in User in the navigation bar of the Application. The University ID is also used to enable or disable features of the Application that require a linked University ID. The Academic Years for Modules Taken, Mark for Modules Taken and Classification for Modules Taken is used to show the Classification and Mark the User&rsquo;s linked University ID achieved in a Module, as well as the Academic Year it achieved that Classification and Mark. Such Data is also used to allow or disallow a User to review a Module (the User can only review the Module if they achieved a Classification in the current Academic Year chosen), and to customise the Review input form(s). <strong><br /><br /> Try to prevent illegitimate or misleading Reviews for Modules<br /></strong>The Academic Years for Modules Taken and Classification for Modules Taken are used to determine if a User has taken a Module on a given Academic Year, by verifying they have achieved ANY final Classification in the Module on the Academic Year. If so, the User is allowed to review the Module, however if not, the User is denied since the Application cannot ensure that the User has done the Module, and so the User may be forging an illegitimate or misleading Review of a Module they have not personally experienced. Ensuring reviews are only from Users that have done the Module in the Academic Year ensures a level of legitimacy in the Reviews, where it&rsquo;s at least ensured that the User has experienced the Module fully.</p>
<p><strong><br /> Contextualise Reviews for Modules<br /></strong>The Academic Years for Modules Taken, Mark for Modules Taken and Classification for Modules Taken are used to contextualise reviews based upon the Classification the linked University Account of the User who made the review achieved in the Module in the Academic Year. For a User&rsquo;s Comments and Suggestions on a Module in an Academic Year, the Classification the University Account linked to the User achieved in the Module in the Academic Year is shown for context. For any Metric, the Classification a User&rsquo;s linked University Account achieved in a Module on an Academic Year is used in the Heat Map with Grade on the x-axis and value on the y-axis, where the User&rsquo;s Classification (grade) and value are used to index the Heat Map for the corresponding aggregate entry they are included into.</p>
<br />
<p>Place of processing: United Kingdom &ndash;&nbsp;<a href="https://warwick.ac.uk/terms/privacy">Privacy Policy</a>.</p>
</section>
<p><h4>Log Files</h4></p>
<p>The Application follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analysing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>
<p><h4>Cookies and Web Beacons</h4></p>
<p>Like any other website, the Application uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing the Application&rsquo;s web page content based on visitors' browser type and/or other information.</p>
<p>For more general information on cookies, please read&nbsp;<a href="https://www.cookieconsent.com/what-are-cookies/">"What Are Cookies"</a>.</p>
<br></br><h2>The rights of Users</h2>
<p>Users may exercise certain rights regarding their Data processed by the Owner.</p>
<p>In particular, Users have the right to do the following:</p>
<ul>
<li><strong>Withdraw their consent at any time.</strong> Users have the right to withdraw consent where they have previously given their consent to the processing of their Personal Data.</li>
<li><strong>Object to processing of their Data.</strong> Users have the right to object to the processing of their Data if the processing is carried out on a legal basis other than consent. Further details are provided in the dedicated section below.</li>
<li><strong>Access their Data.</strong> Users have the right to learn if Data is being processed by the Owner, obtain disclosure regarding certain aspects of the processing and obtain a copy of the Data undergoing processing.</li>
<li><strong>Verify and seek rectification.</strong> Users have the right to verify the accuracy of their Data and ask for it to be updated or corrected.</li>
<li><strong>Restrict the processing of their Data.</strong> Users have the right, under certain circumstances, to restrict the processing of their Data. In this case, the Owner will not process their Data for any purpose other than storing it.</li>
<li><strong>Have their Personal Data deleted or otherwise removed.</strong> Users have the right, under certain circumstances, to obtain the erasure of their Data from the Owner.</li>
<li><strong>Receive their Data and have it transferred to another controller.</strong> Users have the right to receive their Data in a structured, commonly used and machine readable format and, if technically feasible, to have it transmitted to another controller without any hindrance. This provision is applicable provided that the Data is processed by automated means and that the processing is based on the User's consent, on a contract which the User is part of or on pre-contractual obligations thereof.</li>
<li><strong>Lodge a complaint.</strong> Users have the right to bring a claim before their competent data protection authority.</li>
</ul>
<h3>Details about the right to object to processing</h3>
<p>Where Personal Data is processed for a public interest, in the exercise of an official authority vested in the Owner or for the purposes of the legitimate interests pursued by the Owner, Users may object to such processing by providing a ground related to their particular situation to justify the objection.</p>
<p>Users must know that, however, should their Personal Data be processed for direct marketing purposes, they can object to that processing at any time without providing any justification. To learn, whether the Owner is processing Personal Data for direct marketing purposes, Users may refer to the relevant sections of this document.</p>
<h3>How to exercise these rights</h3>
<p>Any requests to exercise User rights can be directed to the Owner through the contact details provided in this document. These requests can be exercised free of charge and will be addressed by the Owner as early as possible and always within one month.</p>
<p><br></br><h2>Advertising Partners Privacy Policies</h2></p>
<p>You may consult this list to find the Privacy Policy for each of the advertising partners of the Application.</p>
<p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on the Application, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
<p>Note that the Application has no access to or control over these cookies that are used by third-party advertisers.</p>
<p><br></br><h2>Third Party Privacy Policies</h2></p>
<p>The Application&rsquo;s Privacy Policy does not apply to other advertisers or websites. Thus, the Owner advises you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
<p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>
<p><br></br><h2>CCPA Privacy Rights (Do Not Sell My Personal Information)</h2></p>
<p>Under the CCPA, among other rights, California consumers have the right to:</p>
<p>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</p>
<p>Request that a business delete any personal data about the consumer that a business has collected.</p>
<p>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</p>
<p>If you make a request, the Owner has one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>
<p><br></br><h2>GDPR Data Protection Rights</h2></p>
<p>The Owner would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
<p>The right to access &ndash; You have the right to request copies of your personal data. The Owner may charge you a small fee for this service.</p>
<p>The right to rectification &ndash; You have the right to request that the Owner corrects any information you believe is inaccurate. You also have the right to request that the Owner completes the information you believe is incomplete.</p>
<p>The right to erasure &ndash; You have the right to request that the Owner erase your personal data, under certain conditions.</p>
<p>The right to restrict processing &ndash; You have the right to request that the Owner restricts the processing of your personal data, under certain conditions.</p>
<p>The right to object to processing &ndash; You have the right to object to the Application&rsquo;s processing of your personal data, under certain conditions.</p>
<p>The right to data portability &ndash; You have the right to request that the Owner transfers the data that the Owner has collected to another organization, or directly to you, under certain conditions.</p>
<p>If you make a request, the Owner has one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>
<p><br></br><h2>Children's Information</h2></p>
<p>Another part of the Owner&rsquo;s priority is adding protection for children while using the internet. The Owner encourages parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
<p>The Owner does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on this website, the Owner strongly encourages you to contact us immediately and the Owner will do their best effort to promptly remove such information from the Application&rsquo;s records.</p>
<br></br><h2>Additional information about Data collection and processing</h2>
<h3>Legal action</h3>
<p>The User's Personal Data may be used for legal purposes by the Owner in Court or in the stages leading to possible legal action arising from improper use of this Application or the related Services.<br /> The User declares to be aware that the Owner may be required to reveal personal data upon request of public authorities.</p>
<h3>Additional information about User's Personal Data</h3>
<p>In addition to the information contained in this privacy policy, this Application may provide the User with additional and contextual information concerning particular Services or the collection and processing of Personal Data upon request.</p>
<h3>System logs and maintenance</h3>
<p>For operation and maintenance purposes, this Application and any third-party services may collect files that record interaction with this Application (System logs) use other Personal Data (such as the IP Address) for this purpose.</p>
<h3>Information not contained in this policy</h3>
<p>More details concerning the collection or processing of Personal Data may be requested from the Owner at any time. Please see the contact information at the beginning of this document.</p>
<h3>How &ldquo;Do Not Track&rdquo; requests are handled</h3>
<p>This Application does not support &ldquo;Do Not Track&rdquo; requests.<br /> To determine whether any of the third-party services it uses honour the &ldquo;Do Not Track&rdquo; requests, please read their privacy policies.</p>
<h3>Changes to this privacy policy</h3>
<p>The Owner reserves the right to make changes to this privacy policy at any time by notifying its Users on this page and possibly within this Application and/or - as far as technically and legally feasible - sending a notice to Users via any contact information available to the Owner. It is strongly recommended to check this page often, referring to the date of the last modification listed at the bottom.<br /><br /> Should the changes affect processing activities performed on the basis of the User&rsquo;s consent, the Owner shall collect new consent from the User, where required.</p>
<br></br><hr></hr>
<br></br><h2>Definitions</h2>
<h4>Personal Data (or Data)</h4>
<p>Any information that directly, indirectly, or in connection with other information &mdash; including a personal identification number &mdash; allows for the identification or identifiability of a natural person.</p>
<h4>Usage Data</h4>
<p>Information collected automatically through this Application (or third-party services employed in this Application), which can include: the IP addresses or domain names of the computers utilized by the Users who use this Application, the URI addresses (Uniform Resource Identifier), the time of the request, the method utilized to submit the request to the server, the size of the file received in response, the numerical code indicating the status of the server's answer (successful outcome, error, etc.), the country of origin, the features of the browser and the operating system utilized by the User, the various time details per visit (e.g., the time spent on each page within the Application) and the details about the path followed within the Application with special reference to the sequence of pages visited, and other parameters about the device operating system and/or the User's IT environment.</p>
<h4>User</h4>
<p>The individual using this Application who, unless otherwise specified, coincides with the Data Subject.</p>
<h4>Data Subject</h4>
<p>The natural person to whom the Personal Data refers.</p>
<h4>Data Processor (or Data Supervisor)</h4>
<p>The natural or legal person, public authority, agency or other body which processes Personal Data on behalf of the Controller, as described in this privacy policy.</p>
<h4>Data Controller (or Owner)</h4>
<p>The natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of Personal Data, including the security measures concerning the operation and use of this Application. The Data Controller, unless otherwise specified, is the Owner of this Application.</p>
<h4>This/The Application</h4>
<p>The means by which the Personal Data of the User is collected and processed.</p>
<h4>Service</h4>
<p>The service provided by this Application as described in the relative terms (if available) and on this site/application.</p>
<h4>European Union (or EU)</h4>
<p>Unless otherwise specified, all references made within this document to the European Union include all current member states to the European Union and the European Economic Area.</p>
<h4>Route / Course of Study</h4>
<p>A course taken by a student at the University of Warwick, to obtain a degree e.g. a BSc or MSc, or some other qualification. A list of Courses at the University of Warwick can be found at <a href="https://warwick.ac.uk/study/undergraduate/courses-2021/">https://warwick.ac.uk/study/undergraduate/courses-2021/</a>.</p>
<h4> Department</h4>
<p>A Department is an Academic Department within the University of Warwick. A list of Academic Departments can be found at <a href="https://warwick.ac.uk/departments/academic/">https://warwick.ac.uk/departments/academic/</a>.</p>
<h4>Academic Year</h4>
<p>Academic Years are the years that span two years, from the start of the study year to the end of the study year, typically in the next year. Typically they are of the form September/October in one year to June/July in the following year.</p>
<h4>Modules Taken</h4>
<p>A University of Warwick&rsquo;s Student&rsquo;s Modules Taken are the Modules that they have taken and finished, and therefore have a Mark and Classification for them.</p>
<h4>Heat Map</h4>
<p>A kind of visualisation chart which has two dimensions and for each 2-dimensional point labels its corresponding frequency and colours it with a colour proportional to its frequency.</p>
<h4>Pie Chart</h4>
<p>A pie chart is a circular statistical graphic, which is divided into slices to illustrate numerical proportion. In a pie chart, the arc length of each slice, is proportional to the quantity it represents.</p>
<h4>Classification</h4>
<p>A Classification in a Module is the University of Warwick&rsquo;s equivalent of a grade. Simplistically, they&rsquo;re one of: First Class, Upper Second Class, Lower Second Class, Third Class, Fail. For more information, visit the University of Warwick&rsquo;s website.</p>
<h4>Mark</h4>
<p>A Mark for a Module is the raw percentage, out of 100, a Student at the University of Warwick achieved in the assessed work across the Module as a whole.</p>
<h4>Review</h4>
<p>A Review is a User&rsquo;s opinion of a Module, as input on the Application. A Review can either be in the form of a Metric, Comment, or a Suggestion.</p>
<h4>Metric</h4>
<p>A Metric is a kind of Review which has a discrete value, i.e. a value which is one of a certain number of options. The different kinds of Metrics can be found in the Reviews for a Module in the Application, under the &ldquo;Ratings&rdquo; section.</p>
<h4>Comment</h4>
<p>A Comment is a kind of Review which is a textual &ldquo;comment&rdquo;, and input by the User. Comments can be found in the Review for a Module in the Application, under the &ldquo;Comments&rdquo; section.</p>
<h4>Suggestion</h4>
<p>A Suggestion is a kind of Review which is a textual &ldquo;suggestion&rdquo;, and input by the User. Suggestions can be found in the Review for a Module in the Application, under the &ldquo;Suggestions&rdquo; section.</p>
<h4>Module</h4>
<p>A Module is a small course taken by a Student on their Route, which may award &ldquo;CATS&rdquo;. A list of Modules at the University of Warwick can be found at <a href="https://courses.warwick.ac.uk/">https://courses.warwick.ac.uk/</a>.</p>
<br></br><hr></hr>
<br></br><h2>Legal information</h2>
<p>This privacy statement has been prepared based on provisions of multiple legislations, including Art. 13/14 of Regulation (EU) 2016/679 (General Data Protection Regulation).</p>
<p>This privacy policy relates solely to this Application, if not stated otherwise within this document.</p>
</Container>
        </React.Fragment>
    )
}