// src/models/restaurant.model.js
class Restaurant {
  constructor({
    id,
    name,
    category,
    location,
    description,
    likes = 0,
    image = '',
    phone = '',
    place_url = '',
  }) {
    this.id = Number(id);
    this.name = name;
    this.category = category;
    this.location = location;
    this.description = description;
    this.likes = Number(likes);
    this.image = image;
    this.phone = phone;
    this.place_url = place_url;
  }

  updateLikes(likes) {
    this.likes = Number(likes);
    return this;
  }
}

module.exports = Restaurant;