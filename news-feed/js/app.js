$( document ).ready(function() {
  
  console.log('JS LOADED!');

  var newsAPI = 'https://newsapi.org/v2/top-headlines?' +
            'country=us&' +
            'apiKey=23ab87be631640c7a41a3e301b9686d6';

  var newsFeed = new Request(newsAPI);

  fetch(newsFeed)
  .then(function(response) {
      console.log(response.json());
  });

  //

  // Display data in HTML
  function displayData(dataPath, templatePath, renderLocation) {
    if ( jQuery(renderLocation).length ) {
      jQuery.ajax({ 
        url: dataPath,
        data: "{}",
        type: "GET",
        dataType: "json",
        async: true,
        crossDomain: true,
        success: function (data) {
          jQuery.get(templatePath, function (template) {
            var rendered = Handlebars.compile(template);
            var result = rendered(data);
            jQuery(renderLocation).html(result);
          });
        },
        error: function (xhr, status) {
        /*Error*/
        }
      });
    }
  }

  displayData(
    newsAPI,
    "index.html",
    "#testNEWS"
  );

});