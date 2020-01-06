window.HELP_IMPROVE_VIDEOJS = false;

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

jQuery(document).ready(function($) {
  var $doc = $(document);
  var $win = $(window);
  var $html = $("html");
  var $body = $("body");
  var bufferTop = 120;
  var isIE =
    (document.all && document.compatMode) || window.navigator.msPointerEnabled;

  $html.removeClass("no-js").addClass("js");

  // Functions
  var getNodeWidth = function(node) {
    var _node = $(node || window)[0];
    return _node.innerWidth ? _node.innerWidth : _node.clientWidth;
  };

  var getNodeHeight = function(node) {
    var _node = $(node || window)[0];
    return _node.innerHeight ? _node.innerHeight : _node.clientHeight;
  };

  var scrollToNode = function(node, parentNode, scrollOptions) {
    var $node = $(node);
    var $parentNode = $(parentNode || document.documentElement);

    if ($node) {
      var nodeOffset = $node.offset();
      var scrollTop = nodeOffset.top - bufferTop;
      var scrollLeft = nodeOffset.left;

      // Center the node in the window
      if (
        scrollOptions &&
        scrollOptions.hasOwnProperty("block") &&
        scrollOptions.block === "center"
      ) {
        scrollTop =
          nodeOffset.top -
          (getNodeHeight($parentNode) - getNodeHeight($node)) * 0.5;
      }

      $parentNode.scrollTop(scrollTop);
      $parentNode.scrollLeft(scrollLeft);
    }
  };

  // Scroll to the node and center the element if it is within the height of the parentNode
  var showNodeById = function(nodeId, parentNode, scrollOptions) {
    var $parentNode = $(parentNode || window);
    var $targetNode = $(nodeId);
    scrollToNode($targetNode, $parentNode, scrollOptions);
  };

  var scrollToHash = function() {
    if (window.location.hash) {
      showNodeById(window.location.hash, document.documentElement, {
        block: "start"
      });
    }
  };

  var checkPastBufferTop = function() {
    if ($win.scrollTop() > bufferTop) {
      $body.addClass("past-scroll-top");
    } else {
      $body.removeClass("past-scroll-top");
    }
  };

  if (window.Swiper) {
    $(".swiper-container").each(function(index, elem) {
      new Swiper(elem, {
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true
        },
        effect: "coverflow",
        spaceBetween: -50,
        coverflowEffect: {
          rotate: 50,
          slideShadows: false
        }
      });
    });
  }

  // Scroll to the anchor on the page
  $win.on("hashchange", function(event) {
    if (event) {
      event.preventDefault();
    }
    scrollToHash();
  });

  $doc.on("click", "[href^='#']", function(event) {
    event.preventDefault();
    var $elem = $(this);
    var targetId = $elem.attr("href");
    showNodeById(targetId);
  });

  $win.on("scroll", debounce(checkPastBufferTop, 50));

  // Scroll to the anchor on the page when ready
  scrollToHash();

  checkPastBufferTop();
});
