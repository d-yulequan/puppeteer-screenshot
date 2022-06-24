var autoScroll = function (page) {
  return page.evaluate(() => {
    return new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      const max_distance = 20000;

      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight >= max_distance) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          requestAnimationFrame(() => {
            resolve();
          });
        }
      }, 100);
    });
  });
};

module.exports = {
  autoScroll,
};
