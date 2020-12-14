var mandrill = require('mandrill-api/mandrill');

const mandrill_client = new mandrill.Mandrill('dRibWyy9lDiLw5Ln8AdacA');


export default function sendmsg() {
var message = {
    "html": "<p>Example HTML content</p>",
    "text": "Example text content",
    "subject": "example subject",
    "from_email": "scheduling@beunstuck.co",
    "from_name": "UNSTUCK",
    "to": [{
            "email": "scheduling@beunstuck.co",
            "name": "JOHN E HOLLER",
            "type": "to"
        }],
    "headers": {
        "Reply-To": "scheduling@beunstuck.co"
    },
    "important": false,
    "track_opens": null,
    "track_clicks": null,
    "auto_text": null,
    "auto_html": null,
    "inline_css": null,
    "url_strip_qs": null,
    "preserve_recipients": null,
    "view_content_link": null,
    "tracking_domain": null,
    "signing_domain": null,
    "return_path_domain": null,
    "merge": true,
    "merge_language": "mailchimp",
    "global_merge_vars": [{
            "name": "merge1",
            "content": "merge1 content"
        }],
    "merge_vars": [{
            "rcpt": "scheduling@beunstuck.co",
            "vars": [{
                    "name": "merge2",
                    "content": "merge2 content"
                }]
        }],
};
var async = false;
var ip_pool = "Main Pool";
var send_at = "2020-12-01 12:00:00";
mandrill_client.messages.send({message, async, ip_pool, send_at}, (result) => {
    console.log(result);
    /*
    [{
            "email": "recipient.email@example.com",
            "status": "sent",
            "reject_reason": "hard-bounce",
            "_id": "abc123abc123abc123abc123abc123"
        }]
    */
}, (e) => {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
});

}