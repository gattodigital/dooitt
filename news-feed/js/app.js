$( document ).ready(function() {
  
  console.log('JS LOADED, COWABUNGA!');

  var apiKey = 'apiKey=23ab87be631640c7a41a3e301b9686d6';

  var newsSources = 'https://newsapi.org/v2/sources?' +
                   'language=en&' +
                   'country=us&' +
                   'category=technology&' + apiKey;

  var newsFeed =  'https://newsapi.org/v2/top-headlines?';

  function displayData(dataPath, templatePath, renderLocation) {
      jQuery.ajax({
        url: dataPath,
        data: '{}',
        success: function (data) {
          jQuery.get(templatePath, function (template) {
            var rendered = Handlebars.compile(template);
            var result = rendered(data);
            jQuery(renderLocation).html(result);
          });
        },
        error: function (xhr, status) {
          console.log('NOOO BUENOOO!')
        }
      });
    }

    // GET URL PARAMETERS
    function getQueryVariable(variable)
    {
     var query = window.location.search.substring(1);
     var vars = query.split("&");
     for (var i=0;i<vars.length;i++) {
             var pair = vars[i].split("=");
             if(pair[0] == variable){return pair[1];}
     }
     return(false);
    }

    // NEWS SOURCES
    displayData(
      newsSources,
      "views/news-source.html",
      "#newsSource"
    );

    // NEWS FEEDS
    displayData(
      newsFeed + 'sources=ars-technica&' + apiKey,
      "views/news-feed.html",
      "#arstechnicaFeed"
    );
    displayData(
      newsFeed + 'sources=crypto-coins-news&' + apiKey,
      "views/news-feed.html",
      "#cryptocoinsnewsFeed"
    );
    displayData(
      newsFeed + 'sources=engadget&' + apiKey,
      "views/news-feed.html",
      "#engadgetFeed"
    );
    displayData(
      newsFeed + 'sources=hacker-news&' + apiKey,
      "views/news-feed.html",
      "#hackernewsFeed"
    );
    displayData(
      newsFeed + 'sources=recode&' + apiKey,
      "views/news-feed.html",
      "#recodeFeed"
    );
    displayData(
      newsFeed + 'sources=techcrunch&' + apiKey,
      "views/news-feed.html",
      "#techcrunchFeed"
    );
    displayData(
      newsFeed + 'sources=techradar&' + apiKey,
      "views/news-feed.html",
      "#techradarFeed"
    );
    displayData(
      newsFeed + 'sources=the-next-web&' + apiKey,
      "views/news-feed.html",
      "#thenextwebFeed"
    );
    displayData(
      newsFeed + 'sources=the-verge&' + apiKey,
      "views/news-feed.html",
      "#thevergeFeed"
    );
    displayData(
      newsFeed + 'sources=wired&' + apiKey,
      "views/news-feed.html",
      "#wiredFeed"
    );



});