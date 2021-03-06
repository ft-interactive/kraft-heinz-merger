export default () => ({ // eslint-disable-line

  // link file UUID
  id: 'be72db98-0b25-11e7-97d1-5e720a26771b',

  // canonical URL of the published page
  // https://ig.ft.com/kraft-heinz-merger/ get filled in by the ./configure script
  url: 'https://ig.ft.com/kraft-heinz-merger/',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2017-03-21T05:00:00Z'),

  headline: 'Build your own Kraft Heinz takeover',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'Make your predictions about the next prey for the food giant',

  topic: {
    name: 'Mergers & Acquisitions',
    url: 'https://www.ft.com/stream/sectionsId/Mjk=-VG9waWNz',
  },

  relatedArticle: {
    // text: 'Related article »',
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
  title: 'The merger model: the next Kraft Heinz target',

  // meta data
  description: 'Make your predictions about the next prey for the food giant',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary_large_image',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  socialImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fim.ft-static.com%2Fcontent%2Fimages%2F3120b48e-0dc0-11e7-b030-768954394623.img?source=ig&width=1200',
  socialHeadline: 'The merger model: Make your predictions about the next prey for Kraft Heinz',
  // socialSummary: '',

  // TWITTER
  twitterImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fim.ft-static.com%2Fcontent%2Fimages%2F3120b48e-0dc0-11e7-b030-768954394623.img?source=ig&width=1200',
  // twitterCreator: '@individual's_account',
  tweetText: 'The merger model: Make your predictions about the next prey for Kraft Heinz',
  twitterHeadline: 'The merger model: the next Kraft Heinz target',

  // FACEBOOK
  facebookImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fim.ft-static.com%2Fcontent%2Fimages%2F3120b48e-0dc0-11e7-b030-768954394623.img?source=ig&width=1200',
  facebookHeadline: 'The merger model: the next Kraft Heinz target',

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
