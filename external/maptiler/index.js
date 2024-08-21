require('dotenv').config();
const axios = require('axios');

const getGeocoding = async (location) => {
    const mapTilerApiKey = process.env.MAPTILER_API_KEY;

    try {
        const response = await axios.get(`https://api.maptiler.com/geocoding/${location}.json`, {
            params: {
                key: mapTilerApiKey,
            }
        });
        return response?.data?.features[0]?.geometry;
    } catch (error) {
        console.error('Error fetching data from MapTiler API:', error);
        return null;
    }
}

module.exports = { getGeocoding };