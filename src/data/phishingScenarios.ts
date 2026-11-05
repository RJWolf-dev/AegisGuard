import { PhishingScenario } from '../types/security';

export const PHISHING_SCENARIOS: PhishingScenario[] = [
  {
    id: 'phish-1',
    type: 'email',
    senderName: 'Microsoft Security Team',
    senderEmailOrNumber: 'no-reply@security-msft-verify.com',
    subjectOrPreview: 'CRITICAL: Your Microsoft 365 Password Expires in 2 Hours',
    body: `Dear Valued Colleague,

Our identity protection system has detected unusual sign-in activity on your Microsoft 365 organization tenant. In accordance with enterprise compliance mandate SEC-8891, your network access credentials will be permanently deactivated within 2 hours.

To avoid business disruption and account termination:
Please retain your current credentials immediately by verifying your employee single sign-on identity:

>> [Keep Same Password & Re-Authenticate](https://login.microsoftonline.com.auth-sso-gateway.net/oauth2)

Failure to authenticate before the deadline will require IT desk physical appointment.

Office 365 Automated Protection Service
Microsoft Corporation`,
    targetUrl: 'https://login.microsoftonline.com.auth-sso-gateway.net/oauth2',
    displayUrl: 'https://login.microsoftonline.com/...',
    urgentFlags: ['Expires in 2 Hours', 'Permanently deactivated', 'Failure to authenticate'],
    redFlagLocations: [
      {
        id: 'flag-sender',
        label: 'Lookalike Spoofed Domain',
        explanation: 'The sender is @security-msft-verify.com, an unregistered third-party domain, NOT the official @microsoft.com domain.'
      },
      {
        id: 'flag-urgency',
        label: 'Fabricated Countdown Urgency',
        explanation: 'Imposing a 2-hour deadline induces panic, overriding critical thinking so the victim clicks without verifying.'
      },
      {
        id: 'flag-link',
        label: 'Deceptive Subdomain Hostname',
        explanation: 'The link looks like Microsoft, but the root domain is "auth-sso-gateway.net", a phishing credential harvesting server.'
      },
      {
        id: 'flag-greeting',
        label: 'Generic Unpersonalized Greeting',
        explanation: 'Generic greetings like "Dear Valued Colleague" indicate bulk automated spam targeting multiple organizations.'
      }
    ],
    attackerGoal: 'Harvest corporate Single Sign-On (SSO) credentials to infiltrate company SharePoint and cloud email systems.',
    explanation: 'This is an enterprise credential harvesting attack. Notice how "login.microsoftonline.com" is merely prepended as subdomains onto "auth-sso-gateway.net".'
  },
  {
    id: 'phish-2',
    type: 'sms',
    senderName: '+1 (833) 948-2201',
    senderEmailOrNumber: '+1 (833) 948-2201',
    subjectOrPreview: '[USPS Tracking] Delivery Exception #US94029141',
    body: `[USPS Tracking]: Your shipment US94029141 cannot be delivered due to incomplete street address details. Our courier has returned the parcel to the regional transit hub.

Please update your delivery postal details within 12 hours to avoid package return to sender:
https://usps-parcel-redirection.xyz/track

(Reply STOP to opt out)`,
    targetUrl: 'https://usps-parcel-redirection.xyz/track',
    displayUrl: 'https://usps-parcel-redirection.xyz/track',
    urgentFlags: ['Incomplete street address', 'Within 12 hours', 'Avoid package return'],
    redFlagLocations: [
      {
        id: 'flag-sms-origin',
        label: 'Toll-Free / Random Number',
        explanation: 'USPS never sends automated parcel exception alerts from random 833 toll-free numbers or personal mobile lines.'
      },
      {
        id: 'flag-sms-tld',
        label: 'Suspicious Cheap TLD (.xyz)',
        explanation: 'Legitimate postal operations operate strictly on "usps.com", never on discount generic top-level domains like .xyz or .top.'
      },
      {
        id: 'flag-sms-urgency',
        label: 'Package Return Ultimatum',
        explanation: 'Threatening that the package will be discarded or returned within 12 hours triggers fear of loss.'
      }
    ],
    attackerGoal: 'Collect credit card numbers under the guise of a small $1.50 "redelivery fee" plus complete physical home address.',
    explanation: 'This is the most widespread smishing campaign worldwide. Carriers do not hold packages hostage over a $1 fee on random domains.'
  },
  {
    id: 'phish-3',
    type: 'email',
    senderName: 'PayPal Billing Department',
    senderEmailOrNumber: 'invoicing-notifications@mail-server992.com',
    subjectOrPreview: 'Invoice #INV-2026-90412 paid to CryptoExchange Corp ($899.00 USD)',
    body: `Hello,

Thank you for your business. You have successfully sent a payment of $899.00 USD to CryptoExchange Global Corp.

Transaction ID: 90218842-TX
Payment Method: Linked Bank Account (Ending in 4018)
Status: Completed

If you did NOT authorize this transaction, do not attempt to dispute it online as funds have already cleared. You must call our Fraud Prevention Desk immediately to reverse the charge:

Toll Free Hotline: +1 (800) 419-0921 (Ext 4)

Thank you for choosing PayPal.`,
    targetUrl: 'tel:+18004190921',
    displayUrl: 'Call +1 (800) 419-0921',
    urgentFlags: ['Funds already cleared', 'Must call immediately', '$899.00 USD'],
    redFlagLocations: [
      {
        id: 'flag-refund-scam',
        label: 'Reverse Phone Scam (Vishing)',
        explanation: 'The email includes NO phishing link! Instead, it uses a fake phone number to bait you into calling a scam call center where operators install AnyDesk/TeamViewer to access your bank.'
      },
      {
        id: 'flag-fake-charge',
        label: 'Shock Value Fake Financial Charge',
        explanation: 'Inventing an $899 crypto charge induces panic, causing people to call the number immediately without checking their bank account.'
      },
      {
        id: 'flag-sender-mail',
        label: 'Mismatched Mail Server Sender',
        explanation: 'Sent from mail-server992.com rather than paypal.com.'
      }
    ],
    attackerGoal: 'Lure the victim into calling a fraudulent call center to install remote-access Trojans and drain bank accounts.',
    explanation: 'This is a "callback phishing" or "refund scam". The attackers want you on the phone so they can verbally manipulate you into installing remote desktop software.'
  }
];
