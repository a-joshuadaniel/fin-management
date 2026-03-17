Below is the ticket I sent to DSR. Feel free to take a look to see if you have any concerns or feedback.

## Summary
Please replace the current custom cookie banner on the Astro frontend with **Cookiebot** and implement **consent-based loading** for analytics and future marketing scripts.

The site currently runs on a headless **Craft CMS** backend with an **Astro** frontend, with **GA4 already implemented** and **HubSpot / future marketing scripts** planned. Our GA4 setup currently uses `client_id` and `craft_id` for reporting, so we want to preserve that behavior **only when the user has consented to Statistics cookies**.

## Goal
Implement a site-wide consent model so that:

- **Necessary cookies** are always allowed
- **GA4** only loads after **Statistics** consent
- **HubSpot tracking / future pixels** only load after **Marketing** consent
- **logged-in/account/site functionality** still works under **Necessary-only** consent
- current `client_id` / `craft_id` analytics behavior is preserved **only** when **Statistics** consent is granted

## Required implementation

### 1) Replace the current custom cookie banner
Please remove or disable the current custom cookie consent component on the Astro frontend and use **Cookiebot** as the single consent solution across the site.

### 2) Add Cookiebot globally
Please insert the Cookiebot script as the **first script** in the shared global `<head>` of the Astro frontend:

```html
<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="7f823b48-16ba-4f3c-a6a9-96a8599fa3f4" data-blockingmode="auto" type="text/javascript"></script>
```

### 3) Implement Google Consent Mode v2
Please add Google Consent Mode v2 defaults globally **before GA4 loads**, with default **denied** values until the user makes a consent choice.

### 4) Consent categories
Cookiebot uses the standard fixed categories:

- Necessary
- Preferences
- Statistics
- Marketing

For our implementation:

- **Necessary** should remain enabled as required
- **Statistics** should be used for GA4
- **Marketing** should be used for HubSpot tracking and future pixels
- **Preferences** should remain unused unless there is a specific technical need

Please confirm whether **Preferences can be hidden from the banner/UI** in our implementation while still keeping Cookiebot’s standard category model intact. Cookiebot’s category model is fixed at four categories, though a category can be omitted from display in a custom banner; it is not actually removed.

### 5) GA4 behavior
Please update the current GA4 implementation so that:

- GA4 does not load until **Statistics consent** is granted
- `_ga` cookies are not set before Statistics consent
- `client_id` is only used/sent when Statistics consent exists
- `craft_id` / `user_id` for logged-in users are only sent to GA4 when Statistics consent exists

Important: our existing GA4 implementation uses `client_id` and `craft_id` across page views, forms, video events, downloads, sharing, course events, and article completion, so this behavior should continue when Statistics consent is granted.

### 6) Marketing scripts
Please ensure HubSpot tracking code and future marketing scripts/pixels are only loaded after **Marketing consent**.

### 7) Review our existing custom Craft CMS script/pixel component
We already have a custom component in Craft CMS that allows us to input scripts such as pixels / LinkedIn Insight tags.

Please confirm:

- whether this component outputs code in the correct place and format for Cookiebot-controlled consent
- whether it is the right place to also add HubSpot tracking code
- whether any changes are needed so scripts inserted through this component are correctly blocked/released by Cookiebot

If this component is not the right place for HubSpot or future marketing scripts, please advise the correct implementation pattern.

### 8) Make current GA event code safe when consent is declined
Please ensure existing event tracking does not throw JS errors when Statistics consent is not granted. Any code that assumes `gtag()` is always available should fail safely.

### 9) Use Cookiebot-compatible script markup where needed
If any scripts need manual markup rather than relying on auto-blocking alone, please use Cookiebot’s supported pattern:

- inline scripts: `type="text/plain"` with `data-cookieconsent="statistics"` or `data-cookieconsent="marketing"`
- external elements/scripts: Cookiebot-compatible consent markup as needed

Cookiebot documents `preferences`, `statistics`, and `marketing` as valid consent values for manual blocking; **necessary is not marked up** and should simply remain unrestricted.

## Banner / UI requirements
Please use:

- banner style: **Allow all / Customize / Deny**
- categories aligned to Cookiebot’s model above
- final display pattern should avoid forcing all toggles open immediately unless required

## English copy
**Title:**
This website uses cookies

**Body:**
We use cookies to help the website function properly and to understand how our resources are used so we can improve the experience for visitors.
Some cookies are necessary for the site to operate, while others help us analyse traffic and support our communication and outreach. Accepting cookies helps us continue improving the site and making our resources more helpful.
You can choose which cookies to allow.

## Brazilian Portuguese
**Title:**
Este site utiliza cookies

**Body:**
Utilizamos cookies para ajudar o site a funcionar corretamente e para entender como nossos recursos são utilizados, para que possamos melhorar a experiência dos visitantes.
Alguns cookies são necessários para o funcionamento do site, enquanto outros nos ajudam a analisar o tráfego e apoiar nossa comunicação e divulgação. Ao aceitar cookies, você nos ajuda a continuar melhorando o site e tornando nossos recursos mais úteis.
Você pode escolher quais cookies deseja permitir.

## Neutral Latin American Spanish
**Title:**
Este sitio web utiliza cookies

**Body:**
Utilizamos cookies para ayudar a que el sitio web funcione correctamente y para entender cómo se utilizan nuestros recursos, lo que nos permite mejorar la experiencia de los visitantes.
Algunas cookies son necesarias para el funcionamiento del sitio, mientras que otras nos ayudan a analizar el tráfico y apoyar nuestra comunicación y alcance. Al aceptar cookies, nos ayudas a seguir mejorando el sitio y haciendo nuestros recursos más útiles.
Puedes elegir qué cookies deseas permitir.

## Acceptance criteria

### Necessary only
In a fresh incognito session, if the user selects **Necessary only**:

- site/account functionality still works as required
- GA4 does not load
- `_ga` cookies are not present
- no GA4 requests fire
- no HubSpot tracking or marketing pixels load

### Statistics accepted
If the user accepts **Statistics**:

- GA4 loads correctly
- `_ga` cookies can be set
- current GA4 reporting continues to work
- `client_id` is available
- for logged-in users, `craft_id` / `user_id` are sent to GA4 as they are today

### Marketing accepted
If the user accepts **Marketing**:

- HubSpot tracking code can load
- future marketing scripts/pixels can load

### General

- current custom cookie banner is removed or disabled
- Cookiebot is the first script in the shared global `<head>`
- no console errors occur when optional tracking is declined
- developer confirms whether the existing Craft custom script/pixel component is the correct place for HubSpot / future marketing scripts
