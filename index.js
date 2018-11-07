/*jslint es6:true*/

const Request = require('request-promise');
const XmlToJson = require('xml2js-es6-promise');

module.exports = class IOSReviewfetcher {

    async fetchReviews(appId, country) {
        const reviews = [];
        let page = 1;
        let finished = false;
        while (!finished) {
            const url = this.getRequestURLForCountry(appId, country, page);
            const result = await Request(url);
            const json = await XmlToJson(result);
            const entries = json.feed.entry;
            if (!entries) {
                break;
            }
            for (const entry of entries) {
                reviews.push(await this.parseReview(appId, entry, country));
            }
            const lastPage = this.getLastPage(json.feed.link);
            if (page !== lastPage) {
                page++;
            } else {
                finished = true;
            }
        }
        return reviews;
    }

    async parseReview(appId, review, country) {
        const rating = parseFloat(review['im:rating']);
		return {
			id: review.id[0],
			text: review.content[0]._,
			title: review.title[0],
			author: review.author ? review.author[0].name[0] : 'Anonymous',
			dateTime: review.updated[0],
			rating: rating,
			appId: appId,
			version: review['im:version'][0],
			countryCode: country			
		}
    }

    getLastPage(json) {
        let page = 1;
        for (const dictionary of json) {
            const type = dictionary.$.rel;
            if (type === 'last') {
                const url = dictionary.$.href;
                const nextPageUrl = url.split('?');
                const urlParts = nextPageUrl[0].split('/');
                for (const urlPart of urlParts) {
                    if (urlPart.includes('page')) {
                        page = parseInt(urlPart.split('=')[1]);
                    }
                }
            }
        }
        return page;
    }

    getRequestURLForCountry(appId, country, page) {
        return 'https://itunes.apple.com/' + country + '/rss/customerreviews/page=' + page + '/id=' + appId + '/sortby=mostrecent/xml';
    }

};
