/// <reference path="../typings/tsd.d.ts" />

class BhwiUser {
  id: number;
  client_id: number;

  constructor(id: number, client_id: number) {
    this.client_id = client_id;
    this.id = id;
  }
}

class Bhwi {
  user: BhwiUser;

  constructor(id: number, client_id: number) {
    this.user = new BhwiUser(id, client_id);
  }

  getImages() {
    var url = 'https://api.instagram.com/v1/users/' + this.user.id + '/media/recent/?client_id=' + this.user.client_id + '&callback=?';

    jQuery.getJSON(url).done((instaPosts) => {
      jQuery.each(instaPosts.data, (index, instaPost) => {
        this._buildWidget(instaPost.link, instaPost.images.standard_resolution.url).appendTo('body');
      });
    });
  }

  _buildLink(link_url: string) {
    return jQuery('<a>').attr('href', link_url);
  }

  _buildImage(image_url: string) {
    return jQuery('<img>').attr('src', image_url);
  }

  _buildWidget(link_url: string, image_url: string) {
    return this._buildLink(link_url).append(this._buildImage(image_url));
  }
}
