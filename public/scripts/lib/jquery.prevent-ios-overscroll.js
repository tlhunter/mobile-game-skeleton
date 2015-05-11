/**
 * Prevents iOS from overscrolling the document body.
 *
 * @url http://stackoverflow.com/a/14130056/538646
 */
if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
	//uses document because document will be topmost level in bubbling
	$(document).on('touchmove',function(e){
	  e.preventDefault();
	});

	//uses body because jquery on events are called off of the element they are
	//added to, so bubbling would not work if we used document instead.
	$('body').on('touchstart','.scrollable',function(e) {
	  if (e.currentTarget.scrollTop === 0) {
		e.currentTarget.scrollTop = 1;
	  } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
		e.currentTarget.scrollTop -= 1;
	  }
	});

	//prevents preventDefault from being called on document if it sees a scrollable div
	$('body').on('touchmove','.scrollable',function(e) {
	  e.stopPropagation();
	});
}
