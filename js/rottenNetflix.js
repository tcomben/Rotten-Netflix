var movieData = null;

//On document ready get the movie data from the Rotten Tomatoes API.
jQuery(document).ready(function () {
    jQuery.ajax({
        url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=APIKEY&q=" + scrapeMovieDataAndFormatMovieTitle() + "&page_limit=1",
        data: "json",
        type: "get"
    }).always(function (d) {
        parseRottenData(d);
    });
});

//If the response was a HTTP 200 and OK, then append the Tomatometer and audience score below the star ratings.
function parseRottenData(d) {
    if (d.status == 200 && d.statusText == "OK") {
        var rData = jQuery.parseJSON(d.responseText);
        if (rData.movies.length > 0) {
            var m = getMovie(rData.movies);
            if (m) {
                var r = m.ratings;
                jQuery(".ratingsInfo")
                    .append("<a href='" + m.links.alternate + "'><div title='" + r.critics_rating + "' class='starbar starbar-avg stbrWrapStc clearfix'><p class='label'> Tomatometer: </p><span class='rating'> " + r.critics_score + "% </span></div><div title='" + r.audience_rating + "' class='starbar starbar-avg stbrWrapStc clearfix'><p class='label'> Audience: </p><span class='rating'> " + r.audience_score + "% </span></div></a>");
            }
        }
        
    } else {
        console.error(d.status, d.statusText);
    }
}

//Scrape the movie title, and year from the HTML on the page, store it in movieData, and return the movie title URL encoded.
function scrapeMovieDataAndFormatMovieTitle() {
    movieData = { movie: $("h2.title").html(), year: $("span.year").html() };
    return encodeURI(movieData.movie);
}

function getMovie(movies) {
    if (movies.length > 1) {
        //find movie with same year
        for (var i = 0; i < movies.length; i++) {
            if (movies[i].year == movieData.year) {
                return movies[i];
            }
        }
    } else if (movies.length == 1) {
        return movies[0];
    } else {
        return null;
    }
}