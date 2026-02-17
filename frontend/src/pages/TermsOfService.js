import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <div className="legal-header">
                    <h1>Terms of Service</h1>
                    <p className="last-updated">Last Updated: February 15, 2026</p>
                </div>

                <div className="legal-content">
                    <div className="legal-section">
                        <h2>1. Acceptance of Terms</h2>
                        <p>Welcome to TailorPro ("Company," "we," "our," "us"). By accessing or using our web-based tailoring management application (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.</p>
                        <p>These Terms constitute a legally binding agreement between you ("User," "you," "your") and TailorPro regarding your use of the Service.</p>
                    </div>

                    <div className="legal-section">
                        <h2>2. Description of Service</h2>
                        <p>TailorPro provides a comprehensive management platform for tailoring businesses, including but not limited to:</p>
                        <ul>
                            <li>Client measurement tracking and management</li>
                            <li>Calendar and deadline scheduling</li>
                            <li>Payment processing and subscription management</li>
                            <li>Client communication tools</li>
                            <li>Business analytics and reporting</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>3. Account Registration and Security</h2>
                        <p>3.1. To use our Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.</p>
                        <p>3.2. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                        <p>3.3. You must immediately notify us of any unauthorized use of your account or any other security breach at support@tailorpro.com.</p>
                        <p>3.4. We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate, false, or incomplete.</p>
                    </div>

                    <div className="legal-section">
                        <h2>4. Subscription and Payments</h2>
                        <p>4.1. <strong>Free Trial:</strong> New users receive a 7-day free trial period. During this trial, you have full access to all Service features.</p>
                        <p>4.2. <strong>Subscription Fees:</strong> After your trial period, a monthly subscription fee of ₦1,500 (or such other amount as we may specify from time to time) will apply. We reserve the right to change our subscription fees upon 30 days' notice to you.</p>
                        <p>4.3. <strong>Payment Terms:</strong> Subscription fees are billed in advance on a monthly basis. Payments are non-refundable except as required by law or as explicitly stated in these Terms.</p>
                        <p>4.4. <strong>Payment Methods:</strong> We accept bank transfers to the designated account provided in your payment dashboard. You must upload proof of payment for verification.</p>
                        <p>4.5. <strong>Late Payment:</strong> If your payment is not received by the due date, we reserve the right to suspend or terminate your access to the Service.</p>
                    </div>

                    <div className="legal-section">
                        <h2>5. User Data and Privacy</h2>
                        <p>5.1. You retain all ownership rights to the client data, measurements, and other information you enter into the Service ("User Data").</p>
                        <p>5.2. You grant us a license to access, use, process, and store your User Data solely to provide, maintain, and improve the Service.</p>
                        <p>5.3. You represent and warrant that you have obtained all necessary consents and permissions to collect, store, and process client data through our Service in compliance with applicable laws, including Nigeria's Data Protection Regulation (NDPR).</p>
                        <p>5.4. We implement reasonable security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
                    </div>

                    <div className="legal-section">
                        <h2>6. Acceptable Use Policy</h2>
                        <p>You agree not to:</p>
                        <ul>
                            <li>Use the Service for any illegal purpose or in violation of any local, state, national, or international law</li>
                            <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
                            <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                            <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                            <li>Attempt to gain unauthorized access to any portion of the Service or any other accounts, systems, or networks</li>
                            <li>Use the Service to store or transmit malicious code, viruses, or other harmful components</li>
                            <li>Reverse engineer, decompile, or disassemble any portion of the Service</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>7. Intellectual Property Rights</h2>
                        <p>7.1. The Service, including its original content, features, functionality, and underlying technology, is owned by TailorPro and is protected by Nigerian and international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                        <p>7.2. You may not copy, modify, distribute, sell, or lease any part of our Service without our prior written consent.</p>
                        <p>7.3. The TailorPro name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of TailorPro.</p>
                    </div>

                    <div className="legal-section">
                        <h2>8. Third-Party Services</h2>
                        <p>The Service may integrate with or contain links to third-party services (e.g., Google Sign-In). We are not responsible for the content, privacy policies, or practices of these third-party services. Your use of such services is at your own risk and subject to their terms and conditions.</p>
                    </div>

                    <div className="legal-section">
                        <h2>9. Termination</h2>
                        <p>9.1. You may terminate your account at any time by contacting us or through your account settings.</p>
                        <p>9.2. We may suspend or terminate your access to the Service at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>
                        <p>9.3. Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
                    </div>

                    <div className="legal-section">
                        <h2>10. Disclaimer of Warranties</h2>
                        <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                        <p>WE DO NOT WARRANT THAT: (A) THE SERVICE WILL MEET YOUR REQUIREMENTS; (B) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (C) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE; OR (D) ANY ERRORS IN THE SERVICE WILL BE CORRECTED.</p>
                    </div>

                    <div className="legal-section">
                        <h2>11. Limitation of Liability</h2>
                        <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL TAILORPRO, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.</p>
                        <p>OUR TOTAL LIABILITY TO YOU SHALL NOT EXCEED THE AMOUNT YOU PAID TO US DURING THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE LIABILITY.</p>
                    </div>

                    <div className="legal-section">
                        <h2>12. Indemnification</h2>
                        <p>You agree to indemnify, defend, and hold harmless TailorPro, its officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party right; or (d) your User Data.</p>
                    </div>

                    <div className="legal-section">
                        <h2>13. Governing Law and Dispute Resolution</h2>
                        <p>13.1. These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of laws provisions.</p>
                        <p>13.2. Any dispute arising out of or relating to these Terms or the Service shall first be attempted to be resolved through informal negotiations. If the dispute cannot be resolved within thirty (30) days, it shall be submitted to mediation in Lagos State, Nigeria, before resorting to litigation.</p>
                        <p>13.3. If mediation fails, the dispute shall be resolved exclusively in the courts of Lagos State, Nigeria, and you consent to the personal jurisdiction of such courts.</p>
                    </div>

                    <div className="legal-section">
                        <h2>14. Changes to Terms</h2>
                        <p>We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on the Service and updating the "Last Updated" date. Your continued use of the Service after such modifications constitutes your acceptance of the revised Terms.</p>
                    </div>

                    <div className="legal-section">
                        <h2>15. Contact Information</h2>
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <address>
                            <p><strong>TailorPro</strong></p>
                            <p>Email: legal@tailorpro.com</p>
                            <p>Address: 123 Adeola Odeku Street, Victoria Island, Lagos, Nigeria</p>
                            <p>Phone: +234 (0) 123 456 7890</p>
                        </address>
                    </div>
                </div>

                <div className="legal-footer">
                    <p>By using TailorPro, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
                    <div className="legal-actions">
                        <Link to="/register" className="btn btn-primary">I Agree</Link>
                        <Link to="/" className="btn btn-secondary">Decline</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;