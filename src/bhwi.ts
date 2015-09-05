/// <reference path="../typings/tsd.d.ts" />

class BhwiUser {
  id: number;
  client_id: number;
  url: string;

  constructor(id: number, client_id: number) {
    this.client_id = client_id;
    this.id = id;
    this.url = this._buildUrl()
  }

  _buildUrl() {
    return 'https://api.instagram.com/v1/users/' + this.id + '/media/recent/?client_id=' + this.client_id + '&callback=?';
  }
}

class Bhwi {
  user: BhwiUser;

  constructor(id: number, client_id: number) {
    this.user = new BhwiUser(id, client_id);
    this._createWidget();
  }

  _createWidget() {
    jQuery.getJSON(this.user.url).done((insta_posts) => {
      jQuery.each(insta_posts.data, (index, insta_posts) => {
        this._buildWidget(insta_posts.link, insta_posts.images.standard_resolution.url).appendTo('#bhwi');
      });
    });
  }

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
