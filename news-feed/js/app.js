$( document ).ready(function() {
  
  console.log('JS LOADED!');

  $('.back-to-top').click(function () {
    $("html, body").animate({
      scrollTop: 0
    }, 1000);
    return false;
  }); 

  /* =================
    NEWS FEED
  ================= */ 

  var apiKey = 'apiKey=23ab87be631640c7a41a3e301b9686d6';

  var newsSources = 'https://newsapi.org/v2/sources?' +
                    'language=en&' +
                    'country=us&' +
                    'category=technology&' + apiKey;

  var newsFeed =  'https://newsapi.org/v2/top-headlines?';

  function displayData(dataPath, templatePath, renderLocation) {
      $.ajax({
        url: dataPath,
        data: '{}',
        success: function (data) {
          $.get(templatePath, function (template) {
            var rendered = Handlebars.compile(template);
            var result = rendered(data);
            $(renderLocation).html(result);
          });
        },
        error: function (xhr, status) {
          console.log('NO BUENO!');
        }
      });
    }

    // NEWS SOURCES
    displayData(
      newsSources,
      "views/news-source.html",
      "#news-source"
    );

    // NEWS FEEDS
    displayData(
      newsFeed + 'sources=ars-technica&' + apiKey,
      "views/news-feed.html",
      "#ars-technica"
    );
    displayData(
      newsFeed + 'sources=crypto-coins-news&' + apiKey,
      "views/news-feed.html",
      "#crypto-coins-news"
    );
    displayData(
      newsFeed + 'sources=engadget&' + apiKey,
      "views/news-feed.html",
      "#engadget"
    );
    displayData(
      newsFeed + 'sources=hacker-news&' + apiKey,
      "views/news-feed.html",
      "#hacker-news"
    );
    displayData(
      newsFeed + 'sources=recode&' + apiKey,
      "views/news-feed.html",
      "#recode"
    );
    displayData(
      newsFeed + 'sources=techcrunch&' + apiKey,
      "views/news-feed.html",
      "#techcrunch"
    );
    displayData(
      newsFeed + 'sources=techradar&' + apiKey,
      "views/news-feed.html",
      "#techradar"
    );
    displayData(
      newsFeed + 'sources=the-next-web&' + apiKey,
      "views/news-feed.html",
      "#the-next-web"
    );
    displayData(
      newsFeed + 'sources=the-verge&' + apiKey,
      "views/news-feed.html",
      "#the-verge"
    );
    displayData(
      newsFeed + 'sources=wired&' + apiKey,
      "views/news-feed.html",
      "#wired"
    );

    // displayData(
    //   googleURL,
    //   "views/google-output.html",
    //   "#googleOutput"
    // );

    /* =================
      GOOGLE SHEETS - COMMENTS
    ================= */ 

    var googleURL = 'https://script.google.com/macros/s/AKfycbz000oixle9FnkZFdWPnnyeOPeyatSRV-x2Y8yf2kAwM5rCyiA/exec';

    $(function() {
      $.getJSON(googleURL, function(data) {
        var html = [];
        $.each(data, function(key,val) {
          for(var x = 0; x < val.length; x++) {
            html += val[x] + '<br>'
          }
          html += '<hr>'
        });
        $("#comments").html(html);
        console.log(html);
      });
      $("#new-comment").submit(function(e) {
        e.preventDefault();
        var formData = $("form#new-comment :input").serialize();
        console.log(formData);
        $.ajax({
          url: googleURL,
          method: 'POST',
          data: formData,
          success: function(data) {
            console.log("success");
          },
        });
      });
    });



}); // END document.ready




































