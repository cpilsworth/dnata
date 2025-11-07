

const top = `<!DOCTYPE html>
<html>
<head>
    <title>{{title}}</title>
    <meta charset="utf-8" />
</head>
<body>`;

const tail = `</body>
</html>`;

const template = `${top}
    <h1>Hello from Fastly Compute@Edge!</h1>
    <p>Path: {{path}}</p>
    <p>Query params:</p>
    <ul>
    {{#params}}
        <li>{{key}} = {{value}}</li>
    {{/params}}
    </ul>
    <p>Request headers:</p>
    <ul>
    {{#headers}}
        <li>{{key}} = {{value}}</li>
    {{/headers}}
    </ul>
${tail}`;

const skywards = `${top}
<div class="skywards-dashboard__container div14">
    <div class="skywards-dashboard__blocks">
        <div class="skywards-dashboard__block-1">
            <div> <img alt="" loading="lazy"
                    src="https://c.ekstatic.net/ecl/logos/skywards/membership-tier-skywards-blue-icon-w360x360.png?h=5xdR3D7ZQ5Uvr-9XWALiIA">
            </div>
            <div class="welcome-message">Welcome, <br><span data-mask="true" class="heading span16"> Mr Christopher
                    Pilsworth </span></div>
        </div>
        <div class="skywards-dashboard__block-2">
            <div class="row">
                <div class="row__item"> <i class="icon icon-fares icon--account-tier" aria-hidden="true"></i>
                    <div class="heading"> Blue Tier </div>
                    <div data-mask="true"><span dir="auto">641 686 264</span></div>
                    <div class="skywards-plus"><a href="/uk/english/skywards/skywards-plus/subscription"
                            class="js-skywards-plus-link" data-id="pagebody_link"
                            data-link="Skywards Dashboard:Skywards Plus"> Subscribe to Skywards+ </a></div>
                </div>
                <div class="row__item"><i class="icon icon-id icon--skywards-miles" aria-hidden="true"></i>
                    <div data-mask="true" class="heading">10,400</div>
                    <div>Skywards Miles</div>
                </div>
                <div class="row__item row__item--expiry"><i
                        class="icon icon-flight-status icon--skywards-expiring-miles" aria-hidden="true"></i>
                    <div data-mask="true" class="heading">10,400</div>
                    <div data-mask="true"> Miles expiring on 31 Aug 2029 </div>
                </div>
            </div>
            <div class="links">
                <div><a href="/uk/english/skywards/account/my-overview/" data-id="pagebody_link"
                        data-link="Skywards Homepage:View My Account"> View My Account</a></div>
                <div><a href="/transfer.aspx?pageurl=/account/uk/english/manage-account/my-statement&amp;section=MYA&amp;th=a95b6324f2263eeb56b7c77f289b8cabf70ab6ef"
                        data-id="pagebody_link" data-link="Skywards Homepage:View Statement">View Statement</a></div>
                <div><a href="/uk/english/skywards/account/my-profile/personal-details/" data-id="pagebody_link"
                        data-link="Skywards Homepage:Update Profile">Update Profile</a></div>
            </div>
        </div>
    </div>
    <div class="skywards-dashboard__block-3">
        <div class="promotional-content">Effective 12th May 2025 classic rewards in First Class will be a Tier benefit
            available only to Platinum, Gold and Silver tier members.</div>
        <div class="cta-container"> <a href="/uk/english/skywards/membership-benefits/" data-id="pagebody_cta"
                data-link="Skywards Homepage:Learn more" class="cta   cta--promotion "> <span
                    class="js-label cta__text">Learn more</span> </a> </div>
    </div>
</div>
${tail}`;



export { skywards, template };