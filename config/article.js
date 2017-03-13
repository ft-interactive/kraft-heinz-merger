export default () => ({ // eslint-disable-line

  // link file UUID
  id: '',

  // canonical URL of the published page
  // https://ig.ft.com/sites/kraft-acquisitions get filled in by the ./configure script
  url: 'https://ig.ft.com/sites/kraft-acquisitions',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date(),

  headline: 'Merger model: the next 3G target',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'Make your own predictions about the next prey for Kraft-Heinz, as the 3G Capital/Buffett backed consumer group sets its sights on another deal',

  topic: {
    name: 'Mergers & Acquisitions',
    url: 'https://www.ft.com/stream/sectionsId/Mjk=-VG9waWNz',
  },

  relatedArticle: {
    // text: 'Related article »',
    // url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language',
  },

  mainImage: {
    title: '',
    description: '',
    url: '',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Sujeet Indap', url: 'https://www.ft.com/stream/authorsId/Q0ItMDMzNDMwNw==-QXV0aG9ycw==' },
    { name: 'Joanna S Kao', url: 'https://www.ft.com/stream/authorsId/NWRlMDQ0Y2MtODA3Mi00N2VlLWEyZGItNWRmYTZhNDNiNWNi-QXV0aG9ycw==' },
  ],

  // Appears in the HTML <title>
  title: '',

  // meta data
  description: '',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialSummary:  '',

  // TWITTER
  // twitterImage: '',
  // twitterCreator: '@individual's_account',
  // tweetText:  '',
  // twitterHeadline:  '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
