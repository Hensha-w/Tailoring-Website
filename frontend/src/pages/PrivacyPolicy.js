import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <div className="legal-header">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last Updated: February 15, 2026</p>
                </div>

                <div className="legal-content">
                    <div className="legal-section">
                        <h2>1. Introduction</h2>
                        <p>TailorPro ("we," "our," "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our tailoring management platform (the "Service").</p>
                        <p>Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by all terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use the Service.</p>
                        <p>We comply with the Nigeria Data Protection Regulation (NDPR) and other applicable data protection laws.</p>
                    </div>

                    <div className="legal-section">
                        <h2>2. Information We Collect</h2>
                        <p>We collect several types of information from and about users of our Service, including:</p>

                        <h3>2.1 Personal Information</h3>
                        <ul>
                            <li><strong>Account Information:</strong> Name, email address, phone number, and password when you register.</li>
                            <li><strong>Profile Information:</strong> Business name, address, and preferences you provide.</li>
                            <li><strong>Payment Information:</strong> Bank account details and payment receipts (processed securely).</li>
                            <li><strong>Communications:</strong> Information you provide when contacting customer support.</li>
                        </ul>

                        <h3>2.2 Client Data</h3>
                        <p>As a tailoring business using our Service, you may enter information about your clients, including:</p>
                        <ul>
                            <li>Client names and contact details</li>
                            <li>Body measurements (chest, waist, hips, etc.)</li>
                            <li>Order history and preferences</li>
                            <li>Appointment dates and notes</li>
                        </ul>
                        <p>This client data is owned and controlled by you. We process it solely on your behalf and according to your instructions.</p>

                        <h3>2.3 Automatically Collected Information</h3>
                        <ul>
                            <li><strong>Usage Data:</strong> How you interact with our Service, features used, pages visited.</li>
                            <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers.</li>
                            <li><strong>Log Data:</strong> Diagnostic information related to your use of the Service.</li>
                            <li><strong>Cookies and Similar Technologies:</strong> We use cookies to enhance your experience.</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>3. How We Use Your Information</h2>
                        <p>We use the information we collect for the following purposes:</p>
                        <ul>
                            <li><strong>To Provide and Maintain the Service:</strong> Including account management, customer support, and service optimization.</li>
                            <li><strong>To Process Payments:</strong> Verify and process subscription payments.</li>
                            <li><strong>To Communicate with You:</strong> Send administrative information, updates, security alerts, and support messages.</li>
                            <li><strong>To Send Reminders:</strong> Calendar notifications and appointment reminders (with your consent).</li>
                            <li><strong>To Improve the Service:</strong> Analyze usage patterns to enhance functionality and user experience.</li>
                            <li><strong>To Comply with Legal Obligations:</strong> Fulfill regulatory requirements and respond to lawful requests.</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>4. Legal Basis for Processing (GDPR/NDPR Compliance)</h2>
                        <p>We process your personal information based on the following legal grounds:</p>
                        <ul>
                            <li><strong>Contract Performance:</strong> To fulfill our obligations under the Terms of Service.</li>
                            <li><strong>Legitimate Interests:</strong> To improve and secure our Service.</li>
                            <li><strong>Consent:</strong> For specific purposes like email reminders (you may withdraw consent at any time).</li>
                            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations.</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>5. Sharing Your Information</h2>
                        <p>We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:</p>
                        <ul>
                            <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our Service (e.g., hosting, payment processing, email delivery). These providers are contractually bound to protect your information.</li>
                            <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority.</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice to you).</li>
                            <li><strong>With Your Consent:</strong> When you explicitly direct us to share information.</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>6. Data Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your personal information, including:</p>
                        <ul>
                            <li>Encryption of data in transit (SSL/TLS)</li>
                            <li>Secure data storage with access controls</li>
                            <li>Regular security assessments</li>
                            <li>Employee training on data protection</li>
                        </ul>
                        <p>However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
                    </div>

                    <div className="legal-section">
                        <h2>7. Data Retention</h2>
                        <p>We retain your personal information for as long as your account is active or as needed to provide the Service. We may also retain and use your information to comply with legal obligations, resolve disputes, and enforce our agreements.</p>
                        <p>Upon termination of your account, we will delete or anonymize your information within 30 days, except where retention is required by law.</p>
                        <p><strong>Client Data:</strong> As a user, you control the retention of your client data. You may delete client records at any time.</p>
                    </div>

                    <div className="legal-section">
                        <h2>8. Your Rights and Choices</h2>
                        <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of the information we hold about you.</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal exceptions).</li>
                            <li><strong>Restriction:</strong> Request restriction of processing.</li>
                            <li><strong>Data Portability:</strong> Receive your information in a structured, commonly used format.</li>
                            <li><strong>Objection:</strong> Object to processing based on legitimate interests.</li>
                            <li><strong>Withdraw Consent:</strong> Withdraw consent at any time (does not affect lawfulness of prior processing).</li>
                        </ul>
                        <p>To exercise these rights, please contact us at privacy@tailorpro.com. We will respond within 30 days.</p>
                    </div>

                    <div className="legal-section">
                        <h2>9. Cookies and Tracking Technologies</h2>
                        <p>We use cookies and similar technologies to enhance your experience. Types of cookies we use:</p>
                        <ul>
                            <li><strong>Essential Cookies:</strong> Required for the Service to function (cannot be disabled).</li>
                            <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Service.</li>
                        </ul>
                        <p>You can control cookies through your browser settings. However, disabling cookies may affect functionality.</p>
                    </div>

                    <div className="legal-section">
                        <h2>10. Third-Party Services</h2>
                        <p>Our Service integrates with third-party services, including:</p>
                        <ul>
                            <li><strong>Google Sign-In:</strong> For authentication (subject to Google's Privacy Policy).</li>
                            <li><strong>Payment Processors:</strong> For handling payments (we do not store full payment card details).</li>
                            <li><strong>Email Services:</strong> For sending notifications and reminders.</li>
                        </ul>
                        <p>We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.</p>
                    </div>

                    <div className="legal-section">
                        <h2>11. Children's Privacy</h2>
                        <p>Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from minors. If you become aware that a minor has provided us with personal information, please contact us immediately.</p>
                    </div>

                    <div className="legal-section">
                        <h2>12. International Data Transfers</h2>
                        <p>Your information may be transferred to and processed in countries other than Nigeria, where our servers or service providers are located. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.</p>
                    </div>

                    <div className="legal-section">
                        <h2>13. Changes to This Privacy Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Service and updating the "Last Updated" date. Your continued use after such changes constitutes acceptance of the revised policy.</p>
                    </div>

                    <div className="legal-section">
                        <h2>14. Contact Information</h2>
                        <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer:</p>
                        <address>
                            <p><strong>TailorPro</strong></p>
                            <p>Attention: Data Protection Officer</p>
                            <p>Email: privacy@tailorpro.com</p>
                            <p>Address: 123 Adeola Odeku Street, Victoria Island, Lagos, Nigeria</p>
                            <p>Phone: +234 (0) 123 456 7890</p>
                        </address>
                    </div>

                    <div className="legal-section">
                        <h2>15. Complaint Resolution</h2>
                        <p>If you are not satisfied with our response, you have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC) or your local data protection authority.</p>
                    </div>
                </div>

                <div className="legal-footer">
                    <p>By using TailorPro, you acknowledge that you have read and understood this Privacy Policy.</p>
                    <div className="legal-actions">
                        <Link to="/register" className="btn btn-primary">I Agree</Link>
                        <Link to="/" className="btn btn-secondary">Decline</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;