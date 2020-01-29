export const SUPPORT_EMAIL = 'support@portway.app'

// NOTE 1/22/20: google groups are dumb and won't let us whitelist the SES bounce sender
// email, so we cannot use portwayalerts@bonkeybong.com to receive notifications.
// In the future we can setup an SNS topic and have the bounce notifications go to that
export const BOUNCE_NOTIFICATION_EMAIL = 'dirk@bonkeybong.com'