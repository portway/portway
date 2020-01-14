# Email

Information on Portway emails sent to customers

## SES

All emails are sent via AWS SES

## Email Templating

- Emails are written in [mjml](https://mjml.io/)  
- The vscode mjml extension is nice for live previews
- ejs templating can be inserted into the mjml templates

After updating the mjml, run `npm run compile-email` to compile an ejs version of the email

## Adding a new email
1. Create the mjml template with ejs tags in `api/src/templates/email/mjml`
1. Run `npm run compile-email`
1. Update the email coordinator constants to add info about the new email: `EMAIL_TEMPLATES` and `EMAIL_TEMPLATE_FILES`
1. Add an email coordinator function to send the email, using the ejs templating
The coordinator will precompile the ejs into render functions on load