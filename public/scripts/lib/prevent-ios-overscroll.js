/**
 * Prevents iOS from overscrolling the document body.
 *
 * @url https://github.com/pinadesign/overscroll
 */
if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
	(function(){var e,d,g,f,c=0,b=0,a;document.addEventListener("touchstart",function(h){clearInterval(a);g=h.target;f=h.target;while((window.getComputedStyle(g)["overflow-x"]!="auto"&&window.getComputedStyle(g)["overflow-x"]!="scroll")||g.parentNode==null){g=g.parentNode}while((window.getComputedStyle(f)["overflow-y"]!="auto"&&window.getComputedStyle(f)["overflow-y"]!="auto")||f.parentNode==null){f=f.parentNode}if(g.parentNode==null){g=null}if(f.parentNode==null){f=null}var i=h.touches[0];e=i.pageX;d=i.pageY},false);document.addEventListener("touchmove",function(h){clearInterval(a);h.preventDefault();var i=h.touches[0];g.scrollLeft=g.scrollLeft-(i.pageX-e);f.scrollTop=f.scrollTop-(i.pageY-d);c=(i.pageX-e);b=(i.pageY-d);e=i.pageX;d=i.pageY},false);document.addEventListener("touchend",function(h){clearInterval(a);a=setInterval(function(){g.scrollLeft=g.scrollLeft-c;f.scrollTop=f.scrollTop-b;c=c*0.9;b=b*0.9;if(c<1&&c>-1&&b<1&&b>-1){clearInterval(a)}},15)},false)})();
}
