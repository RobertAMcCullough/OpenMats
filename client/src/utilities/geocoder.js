//this is used for the 2 search bars - one on home screen and one on nav bar. geocoding is also done separately in the Create componant when a new gym is created
//accepts 3 arguments - first is geocoder (created by 'geocoder = new window.google.maps.Geocoder()'), second is search term, third is history, so use can be navigated to search results page after geocoding is done, where componentDidMount will execute search.  Component that calls this function must be using GoogleAPIWrapper.

//results are set to sessionStorage instead of redux store so they are still available after a page refresh
export default (geocoder, searchTerm, history, options) => {
  geocoder.geocode({ address: searchTerm }, (res, status) => {
    //store the search data on local storage so it isn't cleared when back arrow/refresh is pressed
    sessionStorage.setItem('searchTerm', searchTerm);
    sessionStorage.setItem('searchStatus', status);
    if (status === 'OK') {
      //prevents error if google cannot find a location associated with search term
      sessionStorage.setItem('lat', res[0].geometry.location.lat());
      sessionStorage.setItem('lng', res[0].geometry.location.lng());
      history.push('/openmats');
    } else {
      alert('Problem with search, please try again.');
    }
  });
};
