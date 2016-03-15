![header](https://raw.githubusercontent.com/cyrilkyburz/bhwi/master/example/example.png)

# bhwi - Blogger Heaven Widget Instagram

A lightweight customizable Instagram widget. Able to handle different APIs.
See the corresponding [bhwi API](https://github.com/cyrilkyburz/bhwi_proxy).

## Installation

### Easiest: jsdelivr 

Thanks to [jsdelivr](https://www.jsdelivr.com/) for hosting it.

Current version can be found here: [https://www.jsdelivr.com/?query=bhwi](https://www.jsdelivr.com/?query=bhwi)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/bhwi/<version>/bhwi.min.css" type="text/css">
<script src="https://cdn.jsdelivr.net/bhwi/<version>/bhwi.min.js"></script>
<!-- latest version can be found in the release section -->
```

### Easy: bower

```sh
bower install bhwi
```

## Example

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/bhwi/<version>/bhwi.min.css" type="text/css">

<!-- Don't forget to load jQuery before bhwi -->
<script src="https://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/bhwi/<version>/bhwi.min.js"></script>

<!-- Insert a element with the id 'bhwi' -->
<div id="bhwi"></div>

<!-- Initialize bhwi -->
<script>
  (function() {
    new Bhwi('your_user_id', {client_id: 'your_client_id'});
  }).call(this);
</script>
```

## Usage

### Initialization of bhwi 


#### Sample 

```js
new Bhwi('your_user_id', {client_id: 'your_client_id'});
```

#### With options

```js
new Bhwi('your_user_id', {url: 'http://right-url/recent_images/', type: 'bhwi', form: 'slider', speed: '2000', lightbox: false});
```

### Options

The first parameter (your_user_id) is th ID you get when looking up your Instagram username (could look like: 2027952057).

The second parameter is a hash, all available options are described in the table below.

Key                       | Default                                           | Others available                  | Notes
------------------------- | ------------------------------------------------- | --------------------------------- | ---------------------
client_id                 | '' (empty)                                        | 'your client id'                  | The client id you get from Instagram API (could look like: 29f9487a7c14f2e46f1e9fa227cb2675)
credits                   | true                                              | false                             | Decide if you wanna show credits (in the footer of the lightbox)
dom_element               | 'bhwi'	                                          | 'any ID'                          | ID of the dom element where the widget will be appended
form                      | 'timeline'                                        | 'slider'                          | Type of the widget
images_number             | {xs: 3, sm: 5, md: 7, lg: 9, xl: 11}              | 'any number' for a screen         | Number of images, depending on screensize (only affecting the build process, not resizing) in the timeline (only available for the timeline)
images_spacing            | 6                                                 | 'any number'                      | Number of px between the images in the timeline (only available for the timeline)
lightbox                  | true                                              | false                             | Enables lightbox
lightbox_background       | false                                             | true                              | Experimental (only looks good with high resolution images)
lightbox_key_navigation   | { previous: 37, next: 39 }                        | 'any unicode key code'            | Only supported previous and next
preloading_images         | true                                              | false                             | Preloads images for slider & lightbox
screen_widths             | { xs: 380, sm: 544, md: 768, lg: 992, xl: 1200 }  | 'any pixel number' for a screen   | The diffrent screen sizes, taken from bootstrap 4
speed                     | 4000  (ms)                                        | 'any number' (ms)                 | Time per slide (only available for the silder)
type                      | 'instagram'                                       | 'bhwi_proxy'                      | Type of API
url                       | '' (empty)                                        | 'bhwi proxy (cdn) url'            | Url of bhwi proxy (cdn) (only required if type 'bhwi_proxy')

## Example

```
git clone git@github.com:cyrilkyburz/bhwi.git
cd bhwi/example
Open index.html in a browser
```

# Development

## Requirements 

* nvm

## Setup

```
git clone git@github.com:cyrilkyburz/bhwi.git
cd bhwi
npm install bower gulp tsd -g
npm install
tsd reinstall --save --overwrite
```

## Gulp

### Development

(Auto compiling)

```
gulp 
```

### Compile

```
gulp compile
```

### Release

```
gulp compile --type production
```

## MIT License

Coypright 2015 - 2016 [Blogger Heaven](https://blogger-heaven.com). See [LICENSE](LICENSE) file.
