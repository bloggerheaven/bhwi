/// <reference path="../typings/tsd.d.ts" />

class BhwiOptions {
  options: any;

  constructor(bhwi_options: any) {
    var default_options = {
      dom_element: 'bhwi', // any id
      type: 'instagram', // or bhwi
      speed: 4000, // ms (only for silder)
      form: 'timeline', // or slider
      images_number: 8, // only for timeline
      lightbox: true
      // url: 'api-url' // if type: 'bhwi'
      // client_id: '1234' // if type: 'instagram'
    };

    this.options = jQuery.extend(default_options, bhwi_options);
    this._validateOptions();
  }

  _validateOptions () {
    if (this.options.type == 'instagram') {
      if (this.options.client_id == null) { throw new Error('For the instagram API the "client_id" is needed.') }
    } else  {
      if (this.options.url == null) { throw new Error('For the bhwi API the "url" is needed.') }
    }
  }
}

class BhwiHelper {
  dom_element: any;

  constructor(dom_element: string) {
    this.dom_element = jQuery('#' + dom_element).addClass('bhwi');
  }

  buildLink(link_url: string) {
    return jQuery('<a>').attr({href: link_url, target: '_blank'});
  }

  buildImage(image_id: number, image_url: string) {
    return jQuery('<img>').attr('src', image_url).addClass('bhwi-image').data('bhwi-image-id', image_id);
  }

  buildSlide(link_url: string, image_id: number, image_url: string) {
    return this.buildLink(link_url).append(this.buildImage(image_id, image_url));
  }

  buildIcon(paths: any) {
    var g = jQuery('<g>');
    jQuery.each(paths, function(index, path) {
      g.append(jQuery('<p>').attr('d', path));
    });
    return jQuery('<svg>').addClass('bhwi-icon').attr({version: '1.1', xmlns: 'http://www.w3.org/2000/svg'}).append(g);
  }

  buildCrossIcon() {
    return this.buildIcon(['M0,0l20,20', 'M20,0l-20,20']);
  }

  buildLeftAngleIcon() {
    return this.buildIcon(['M15,0l-10,10l10,10']);
  }

  buildRightAngleIcon() {
    return this.buildIcon(['M5,0l10,10l-10,10']);
  }

  append(jquery_element: any) {
    jquery_element.appendTo(this.dom_element);
  }

  interval(func: any, delay: number) {
    func();
    var func_wrapper = () => { this.interval(func, delay) };
    setTimeout(func_wrapper, delay);
  }

  nullTry(object: any, key: string) {
    if (object == null) {
      return object
    } else {
      return object[key]
    }
  }
}

class BhwiSliderCurrent {
  position: number;
  bhwi_image: BhwiImage;
  jquery_element: any;

  constructor() {
    this.position = -1; // Hack: find better solution
  }

  setSliderCurrent(position: number, bhwi_image: BhwiImage, jquery_element: any) {
    this.position = position;
    this.bhwi_image = bhwi_image;
    this.jquery_element = jquery_element;
  }
}

class BhwiSlider {
  bhwi_helper: BhwiHelper;
  bhwi_images: BhwiImages;
  bhwi_options: BhwiOptions;
  bhwi_silder_current: BhwiSliderCurrent;
  speed: number;

  constructor(bhwi_helper: BhwiHelper, bhwi_images: BhwiImages, bhwi_options: BhwiOptions) {
    this.bhwi_silder_current = new BhwiSliderCurrent();
    this.bhwi_helper = bhwi_helper;
    this.bhwi_images = bhwi_images;
    this.bhwi_options = bhwi_options;
    this.speed = this.bhwi_options.options.speed;
    this.bhwi_helper.interval(this._sildeImage, this.speed);

    this.bhwi_helper.dom_element.addClass('bhwi-slider')
  }

  _setImage(bhwi_image: BhwiImage, position: number) {
    var jquery_element = jQuery('a[href$="' + bhwi_image.link + '"]');

    if (jquery_element.length) {
      jquery_element.addClass('current').fadeIn(this.speed / 2);
    } else {
      jquery_element = this.bhwi_helper.buildSlide(bhwi_image.link, bhwi_image.id, bhwi_image.low).addClass('current').fadeIn(this.speed / 2);
      this.bhwi_helper.append(jquery_element);
    }

    this.bhwi_silder_current.setSliderCurrent(position, bhwi_image, jquery_element);
  }

  _sildeImage = () => {
    var next_position = this.bhwi_silder_current.position + 1;

    if (next_position != 0) this.bhwi_silder_current.jquery_element.removeClass('current').fadeOut(this.speed / 2);
    if (next_position == this.bhwi_images.images.length) next_position = 0;

    this._setImage(this.bhwi_images.images[next_position], next_position);
  };
}

class BhwiTimeline {
  bhwi_helper: BhwiHelper;
  bhwi_images: BhwiImages;
  bhwi_options: BhwiOptions;

  constructor(bhwi_helper: BhwiHelper, bhwi_images: BhwiImages, bhwi_options: BhwiOptions) {
    this.bhwi_helper = bhwi_helper;
    this.bhwi_images = bhwi_images;
    this.bhwi_options = bhwi_options;

    this.bhwi_helper.dom_element.addClass('bhwi-timeline');
    this._setAllImages();
    this._responsiveImages();
  }

  _setAllImages () {
    var loaded_images = 0;
    jQuery.each(this.bhwi_images.images, (index: number, bhwi_image: BhwiImage) => {
      var image_wrapper = this.bhwi_helper.buildSlide(bhwi_image.link, bhwi_image.id, bhwi_image.low);
      this.bhwi_helper.append(image_wrapper);
      jQuery(image_wrapper).find('img').on('load', () => {
        loaded_images++;
        if (loaded_images == this.bhwi_options.options.images_number) { this._resizeImages(); }
      });
      if (index == (this.bhwi_options.options.images_number - 1)) return false;
    });
  }

  _resizeImages () {
    var images = jQuery(this.bhwi_helper.dom_element).find('img');
    images.height('auto');
    images.height(images.height());
  }

  _responsiveImages () {
    $(window).resize( () => { this._resizeImages() });
  }
}

class BhwiLightbox {
  bhwi_helper: BhwiHelper;
  bhwi_options: BhwiOptions;
  bhwi_images: BhwiImages;
  dom_element: any;

  constructor(bhwi_helper: BhwiHelper, bhwi_options: BhwiOptions, bhwi_images: BhwiImages) {
    this.bhwi_helper = bhwi_helper;
    this.bhwi_options = bhwi_options;
    this.bhwi_images = bhwi_images;
    this._buildLightbox();
  }

  _buildLightbox() {
    var image_section = jQuery('<div>').addClass('bhwi-image-section');
    var text_section = jQuery('<div>').addClass('bhwi-text-section');
    var content = jQuery('<div>').addClass('bhwi-content');
    var lightbox = jQuery('<div>').addClass('bhwi-lightbox').attr('id', 'bhwi-lightbox');
    this.dom_element = lightbox.append(content.append(image_section, text_section)).appendTo('body');
    this._addLightboxListener();
  }

  _addLightboxListener() {
    jQuery('.bhwi-image').click((event) => {
      event.preventDefault();
      this._addImageToLightbox(this.bhwi_images.find(jQuery(event.target).data('bhwi-image-id')));
    });
    this.dom_element.click((event) => {
      if (! jQuery(event.target).closest('.bhwi-content').length) {
        this.dom_element.fadeOut();
      }
    });
  }

  _addImageToLightbox(bhwi_image: BhwiImage) {
    var bhwi_image_section = this.dom_element.find('.bhwi-image-section');
    bhwi_image_section.empty();
    bhwi_image_section.append(this.bhwi_helper.buildSlide(bhwi_image.link, bhwi_image.id, bhwi_image.standard));

    var bhwi_text_section = this.dom_element.find('.bhwi-text-section'); // TODO: implement correct structure
    bhwi_text_section.empty();
    bhwi_text_section.append(bhwi_image.text);

    this.dom_element.fadeIn();
  }
}

class BhwiImage {
  id: number;
  link: string;
  standard: string;
  low: string;
  thumbnail: string;
  author: string;
  text: string;
  created_time: number;

  constructor(id: number, link: string, standard: string, low: string, thumbnail: string, author: string, text: string, created_time: number) {
    this.id = id;
    this.link = link;
    this.standard = standard;
    this.low = low;
    this.thumbnail = thumbnail;
    this.author = author;
    this.text = text;
    this.created_time = created_time;
  }
}

class BhwiImages {
  images: Array<BhwiImage>;

  constructor() {
    this.images = new Array<BhwiImage>();
  }

  addImage(image: BhwiImage) {
    this.images.push(image);
  }

  addBuildImage(link: string, standard: string, low: string, thumbnail: string, author: string, text: string, created_time: number) {
    this.addImage(new BhwiImage(this.images.length, link, standard, low, thumbnail, author, text, created_time));
  }

  find(id: number) {
    return this.images[id];
  }
}

class BhwiUser {
  id: number;
  url: string;

  constructor(id: number, bhwi_options: BhwiOptions) {
    this.id = id;
    if ('bhwi' === bhwi_options.options.type) {
      this.url = this._buildBhwiUrl(bhwi_options.options.url);
    } else {
      this.url = this._buildInstagramUrl(bhwi_options.options.client_id);
    }
  }

  _buildInstagramUrl(client_id: string) {
    return 'https://api.instagram.com/v1/users/' + this.id + '/media/recent/?client_id=' + client_id + '&callback=?';
  }

  _buildBhwiUrl(url: string) {
    return url + this.id
  }
}

class Bhwi {
  bhwi_options: BhwiOptions;
  bhwi_helper: BhwiHelper;
  bhwi_user: BhwiUser;
  bhwi_images: BhwiImages;
  bhwi_silder: BhwiSlider;
  bhwi_timeline: BhwiTimeline;

  constructor(id: number, options: any) {
    this._basicVaildation(id, options);
    this.bhwi_options = new BhwiOptions(options);
    this.bhwi_helper = new BhwiHelper(this.bhwi_options.options.dom_element);
    this.bhwi_user = new BhwiUser(id, this.bhwi_options);
    this.bhwi_images = new BhwiImages;
    this._callApi();
  }

  _initBhwiSlider = () => {
    this.bhwi_silder = new BhwiSlider(this.bhwi_helper, this.bhwi_images, this.bhwi_options)
  };

  _initBhwiTimeline = () => {
    this.bhwi_timeline = new BhwiTimeline(this.bhwi_helper, this.bhwi_images, this.bhwi_options)
  };

  _decideInit = function () {
    switch(this.bhwi_options.options.form) {
      case 'slider':
        this._initBhwiSlider();
        break;
      default:
        this._initBhwiTimeline();
    }
    if (this.bhwi_options.options.lightbox) {
      new BhwiLightbox(this.bhwi_helper, this.bhwi_options, this.bhwi_images)
    }
  };

  _callApi() {
    jQuery.getJSON(this.bhwi_user.url).done((insta_posts) => {
      jQuery.each(insta_posts.data, (index, insta_posts) => {
        this.bhwi_images.addBuildImage(insta_posts.link, insta_posts.images.standard_resolution.url,
          insta_posts.images.low_resolution.url, insta_posts.images.thumbnail.url, insta_posts.user.username,
          this.bhwi_helper.nullTry (insta_posts.caption, 'text'), insta_posts.created_time);
      });
      this._decideInit();
    });
  }

  _basicVaildation(id: any, options: any) {
    if (id == null) { throw new Error('The param "id" is required.') }
    if (options == null) { throw new Error('The param "options" are required.') }
  }
}
