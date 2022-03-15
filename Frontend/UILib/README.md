# Klara-UI

A repository for shared components and styles used in Klara.

## Get Started

```
npm install klara-ui
```

### Publishing

```
npm run bump
npm publish [--tag next]
```

## Usage

### Components

Klara UI comes with a set of components. They adhere to the overall design, and allow for some configuration.

* [Autocomplete](/components/AutocompletePage)
* [Badge](/components/Badge)
* [Button]/components/Button)
* [Dateformat](/components/DateFormat)
* [Dropdown](/components/Dropdown)
* [Icon](/components/Icon)
* [Notification](#/components/Notifications)
* [Spinner](/components/Spinner)
* [Switch](/components/Switch)
* [TextField](/components/TextField)
* [TextField - Custom](/components/TextFieldCustom)
* [TextHighlight](/components/TextHighlight)
* [Tooltip](/components/Tooltip)

### Styles

All the styles should be in the form of .styl
If you add a new file don't forget to import it in the styles.styl

#### Using the styles

Including styles in your own project can be tricky if not done correctly.
Fortunately we can use stylus loader for resolving to .styl files in node*modules*

Include all the styles in your .styl with:

```
@import "~klara-ui/style/styles.styl"
```

You can also specify the precise path for a file, eg.

```
@import "~klara-ui/style/variables/typography.styl"
```

Read more at: https://www.npmjs.com/package/stylus-loader

## Site


The `site` folder contains all code for the site. Build and run it using the npm scripts:

```
npm run site:start
npm run site:build
npm run site:publish
```
