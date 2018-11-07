# iOSReviewFetcher
Fetches reviews of ios apps from itunes. Should theoratically also work for anything listed on itunes,

Usage:

```javascript
const IOSReviewfetcher = require('iosreviewfetcher');
const iosFetcher = new IOSReviewfetcher();
//1063224663 is the itunes app id
//nl is the countrycode we want to fetch reviews for
iosFetcher.fetchReviews('1063224663', 'nl').then((result) => {
    console.log(result);
});
```

The result will look like:
```javascript
{ 
    id: '1368872528',
    text: "Some text",
    title: 'Some title',
    author: 'Some author',
    dateTime: '2016-10-18T05:43:54-07:00',
    rating: 5,
    appId: '1063324663',
    version: '1.2.1',
    countryCode: 'nl' 
}
```

How does it work:
It uses the apple rss feeds to get the reviews.
An example rss feed is: https://itunes.apple.com/nl/rss/customerreviews/page=1/id=1423224663/sortby=mostrecent/xml 
The appid in the url is a fake one, so the url leads to nowhere.