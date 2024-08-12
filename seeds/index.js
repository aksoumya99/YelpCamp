const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connection");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const getUnsplashImage = async () => {
    const url = 'https://api.unsplash.com/collections/483251/photos?id=483251';
    const headers = {
        "Accept-Version": "v1",
        "Authorization": "Client-ID ui08PZRnyJuh02O6hRbXmpIeSe-n1pYCE64HDz6DnWQ"
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'Accept-Version': 'v1',
                'Authorization': 'Client-ID ui08PZRnyJuh02O6hRbXmpIeSe-n1pYCE64HDz6DnWQ'
            }
        });
        const randomPhotoIndex = Math.floor(Math.random() * (response.data.length));
        return response.data[randomPhotoIndex].urls.small;
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '66b4bac1b0454a7c7e27a93e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await getUnsplashImage(),
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius nam facere fugiat accusantium commodi amet, nulla rerum saepe a quisquam provident recusandae itaque vero? Quis veniam rerum corrupti voluptatibus ducimus?',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})