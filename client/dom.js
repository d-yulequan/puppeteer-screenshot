const checkBodyScroll = (page) => {
  return page.evaluate(() => {
    return new Promise((resolve) => {
      const { position, overflowY } = getComputedStyle(document.body);
      if (position === "fixed" && overflowY === "hidden") {
        document.body.style.position = "unset";
        document.documentElement.style.position = "unset";
        document.documentElement.style.overflowY = "scroll";
      }

      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
};

const modalKiller = (page) => {
  return page.evaluate(() => {
    return new Promise((resolve) => {
      function notAllMine(target) {
        const bodyRect = target.getBoundingClientRect();
        const centerX = bodyRect.x + bodyRect.width / 2;
        const centerY = bodyRect.y + bodyRect.height / 2;
        const offset = +((centerY - bodyRect.y) / 10).toFixed(2);

        let startY = 0;
        const topEls = [];
        while (startY <= centerY) {
          startY += offset;
          const pointEl = document.elementFromPoint(centerX, startY);
          if (target.contains(pointEl)) {
            topEls.push(pointEl);
          }
        }

        return topEls.length;
      }

      const OCCUPY_SPACE = 0.95;
      const all = document.querySelectorAll("*");
      const targetList = Array.from(all).filter((i) => {
        const { zIndex, position } = getComputedStyle(i);
        return position === "fixed" && +zIndex > 0;
      });

      const resDom = [];

      targetList.forEach(async (d) => {
        const { width, height, left, right, top, bottom } = getComputedStyle(d);

        const clientWidth = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight;
        const domWidth = width.replace("px", "");
        const domHeight = height.replace("px", "");

        let side = 0;
        if (right === "0px") side++;
        if (bottom === "0px") side++;
        if (left === "0px") side++;
        if (top === "0px") side++;

        const rule1 = side >= 2;
        const rule2 = Number((domWidth / clientWidth).toFixed(2)) > OCCUPY_SPACE;
        const rule3 = top !== "0px";

        if ((rule1 || rule2) && top !== "0px") {
          resDom.push(d);
        } else if (rule1 && domWidth >= clientWidth && domHeight >= clientHeight && notAllMine(d)) {
          resDom.push(d);
        } else {
          const { y: y1 } = d.getBoundingClientRect();

          if (rule3) {
            window.scrollBy(0, 10);
            requestAnimationFrame(() => {
              let { y: y2 } = d.getBoundingClientRect();
              y1 === y2 && resDom.push(d);
              window.scrollBy(0, -10);
            });
          }
        }
      });

      requestAnimationFrame(() => {
        resDom.forEach((dom) => {
          dom.innerHTML = null;
          dom.parentElement?.removeChild(dom);
        });
        resolve();
      });
    });
  });
};

module.exports = {
  modalKiller,
  checkBodyScroll,
};
