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
      function notAllMineFullScreen(target) {
        const STEP = 10;
        const bodyRect = target.getBoundingClientRect();
        const centerX = bodyRect.x + bodyRect.width / 2;
        const centerY = bodyRect.y + bodyRect.height / 2;
        const offset = +((centerY - bodyRect.y) / STEP).toFixed(2);

        let startY = 0;
        const topEls = [];
        while (startY <= centerY) {
          startY += offset;
          const pointEl = document.elementFromPoint(centerX, startY);
          if (target.contains(pointEl)) {
            topEls.push(pointEl);
          }
        }

        let startX = 0;
        const leftEls = [];
        while (startX <= centerX) {
          startX += offset;
          const pointEl = document.elementFromPoint(startX, centerY);
          if (target.contains(pointEl)) {
            leftEls.push(pointEl);
          }
        }

        return topEls?.length !== STEP || leftEls?.length !== STEP;
      }

      function getAllTargetList(positionType = "fixed") {
        const all = document.querySelectorAll("*");
        const targetList = Array.from(all).filter((i) => {
          const { zIndex, position } = getComputedStyle(i);
          return position === positionType && +zIndex > 0;
        });
        return targetList;
      }

      function getTopLevelChildren(positionType = "fixed") {
        return Array.from(getAllTargetList(positionType).filter((i) => i.parentElement === document.body));
      }

      function killAbsoluteCenter() {
        const absoluteChildren = getTopLevelChildren("absolute");
        absoluteChildren.forEach((dom) => {
          const { right, x, width } = dom.getBoundingClientRect();
          if (right - width === x) dom.parentElement.removeChild(dom);
        });
      }

      const OCCUPY_SPACE = 0.95;
      const targetList = getAllTargetList();
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

        if ((rule1 || rule2) && rule3) {
          resDom.push(d);
        } else if (
          rule1 &&
          domWidth >= clientWidth &&
          domHeight >= clientHeight &&
          (notAllMineFullScreen(d) || d.parentElement === document.body)
        ) {
          resDom.push(d);
        } else if (rule3) {
          const { y: y1 } = d.getBoundingClientRect();
          window.scrollBy(0, 10);
          requestAnimationFrame(() => {
            let { y: y2 } = d.getBoundingClientRect();
            y1 === y2 && resDom.push(d);
            window.scrollBy(0, -10);
          });
        }
      });

      requestAnimationFrame(() => {
        const bodyChildren = getTopLevelChildren();

        resDom.forEach((dom) => {
          let topChild = null;
          bodyChildren.forEach((top) => {
            top.contains(dom) && (topChild = top);
          });

          if (topChild) {
            document.body.removeChild(topChild);
          } else {
            dom.innerHTML = null;
            dom.parentElement?.removeChild(dom);
          }
        });

        killAbsoluteCenter();

        bodyChildren.forEach(
          (top) => top.innerText.toLowerCase().includes("cookies") && top.parentElement?.removeChild(top)
        );
        resolve();
      });
    });
  });
};

module.exports = {
  autoScroll,
  modalKiller,
  checkBodyScroll,
};
