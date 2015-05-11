/**
 * Prevents iOS from overscrolling the document body.
 *
 * @url http://stackoverflow.com/a/20014904/538646
 */
if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
	$(function() {
		document.addEventListener("touchmove", function(e){
			e.preventDefault();
		}, false);
	});
}
