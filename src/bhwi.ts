/// <reference path="../typings/tsd.d.ts" />

class BhwiHelper {
  _buildLink(link_url: string) {
    return jQuery('<a>').attr({href: link_url, target: '_blank'});
  }

  _buildImage(image_url: string) {
    return jQuery('<img>').attr('src', image_url);
  }

  _buildWidget(link_url: string, image_url: string) {
    return this._buildLink(link_url).append(this._buildImage(image_url));
  }
}

class BwhiSlider {}

class BhwiImage {
  link: string;
  standard: string;
  thumbnail: string;

  constructor(link: string, standard: string, thumbnail: string) {
    this.link = link;
    this.standard = standard;
    this.thumbnail = thumbnail;
  }
}

class BhwiImages {
  images: BhwiImage[];

  constructor() {
    this.images = new Array;
  }

  addImage(image: BhwiImage) {
    this.images.push(image);
  }

  addBuildImage(link: string, standard: string, thumbnail: string) {
    this.addImage(new BhwiImage(link, standard, thumbnail));
  }
}

class BhwiUser {
  id: number;
  client_id: number;
  url: string;

  constructor(id: number, client_id: number) {
    this.client_id = client_id;
    this.id = id;
    this.url = this._buildUrl();
  }

  _buildUrl() {
    return 'https://api.instagram.com/v1/users/' + this.id + '/media/recent/?client_id=' + this.client_id + '&callback=?';
  }
}

class Bhwi {
  bhwi_user: BhwiUser;
  bhwi_images: BhwiImages;

  constructor(id: number, client_id: number) {
    this.bhwi_user = new BhwiUser(id, client_id);
    this.bhwi_images = new BhwiImages;
    this._fillBhwiImages();
    console.log(this.bhwi_images);
  }

  _fillBhwiImages() {
    jQuery.getJSON(this.bhwi_user.url).done((insta_posts) => {
      jQuery.each(insta_posts.data, (index, insta_posts) => {
        this.bhwi_images.addBuildImage(insta_posts.link, insta_posts.images.standard_resolution.url, insta_posts.images.thumbnail.url);
      });
    });
  }
}
