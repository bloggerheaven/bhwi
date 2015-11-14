/// <reference path="../typings/tsd.d.ts" />

class BhwiOptions {
  options: any;

  constructor(bhwi_options: any) {
    var default_options = {
      dom_element: 'bhwi', // any id
      type: 'instagram', // or bhwi
      speed: 4000, // ms
      form: 'timeline', // or slider
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

  buildImage(image_url: string) {
    return jQuery('<img>').attr('src', image_url);
  }

  buildSlide(link_url: string, image_url: string) {
    return this.buildLink(link_url).append(this.buildImage(image_url));
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
      return null
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
  bhwi_silder_current: BhwiSliderCurrent;
  speed: number;

  constructor(bhwi_helper: BhwiHelper, bhwi_images: BhwiImages, speed: number) {
    this.bhwi_silder_current = new BhwiSliderCurrent();
    this.bhwi_helper = bhwi_helper;
    this.bhwi_images = bhwi_images;
    this.speed = speed;
    this.bhwi_helper.interval(this._sildeImage, this.speed);

    this.bhwi_helper.dom_element.addClass('bhwi-slider')
  }

  _setImage(bhwi_image: BhwiImage, position: number) {
    var jquery_element = $('a[href$="' + bhwi_image.link + '"]');

    if (jquery_element.length) {
      jquery_element.addClass('current').fadeIn(this.speed / 2);
    } else {
      jquery_element = this.bhwi_helper.buildSlide(bhwi_image.link, bhwi_image.standard).addClass('current').fadeIn(this.speed / 2);
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

class BhwiImage {
  link: string;
  standard: string;
  thumbnail: string;
  author: string;
  text: string;
  created_time: number;

  constructor(link: string, standard: string, thumbnail: string, author: string, text: string, created_time: number) {
    this.link = link;
    this.standard = standard;
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

  addBuildImage(link: string, standard: string, thumbnail: string, author: string, text: string, created_time: number) {
    this.addImage(new BhwiImage(link, standard, thumbnail, author, text, created_time));
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
  bhwi_user: BhwiUser;
  bhwi_images: BhwiImages;
  bhwi_helper: BhwiHelper;
  bhwi_silder: BhwiSlider;
  bhwi_options: BhwiOptions;

  constructor(id: number, options: any) {
    this._basicVaildation(id, options);
    this.bhwi_options = new BhwiOptions(options);
    this.bhwi_helper = new BhwiHelper(this.bhwi_options.options.dom_element);
    this.bhwi_user = new BhwiUser(id, this.bhwi_options);
    this.bhwi_images = new BhwiImages;
    this._fillBhwiImages(this._initBhwiSlider);
  }

  _initBhwiSlider = () => {
    this.bhwi_silder = new BhwiSlider(this.bhwi_helper, this.bhwi_images, this.bhwi_options.options.speed)
  };

  _fillBhwiImages(callback: any) {
    jQuery.getJSON(this.bhwi_user.url).done((insta_posts) => {
      jQuery.each(insta_posts.data, (index, insta_posts) => {
        this.bhwi_images.addBuildImage(insta_posts.link, insta_posts.images.standard_resolution.url,
          insta_posts.images.thumbnail.url, insta_posts.user.username,
          this.bhwi_helper.nullTry (insta_posts.caption, 'text'), insta_posts.created_time);
      });
      callback();
    });
  }

  _basicVaildation(id: any, options: any) {
    if (id == null) { throw new Error('The param "id" is required.') }
    if (options == null) { throw new Error('The param "options" are required.') }
  }
}
