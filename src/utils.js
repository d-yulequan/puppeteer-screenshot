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
      if ((position === "fixed" && overflowY === "hidden") || overflowY === "hidden") {
        document.body.style.position = "unset";
        document.body.style.overflowY = "scroll";
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

        if (!(bodyRect.width && bodyRect.x >= 0 && bodyRect.y >= 0)) return false;

        const centerX = bodyRect.x + bodyRect.width / 2;
        const centerY = bodyRect.y + bodyRect.height / 2;
        const offsetY = +((centerY - bodyRect.y) / STEP).toFixed(2);
        const offsetX = +((centerX - bodyRect.x) / STEP).toFixed(2);

        let startY = 0;
        const topEls = [];
        while (startY <= centerY) {
          startY += offsetY;
          const pointEl = document.elementFromPoint(centerX, startY);
          if (target.contains(pointEl)) {
            topEls.push(pointEl);
          }
        }

        let startX = 0;
        const leftEls = [];
        while (startX <= centerX) {
          startX += offsetX;
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

      function onCenter(dom) {
        const { right, x, width } = dom.getBoundingClientRect();
        return right - width === x;
      }

      function killAbsoluteCenter() {
        const absoluteChildren = getTopLevelChildren("absolute");
        absoluteChildren.forEach((dom) => {
          onCenter(dom) && dom.parentElement.removeChild(dom);
        });
      }

      function killMaxZIndexTop(list) {
        if (!list.length) return;

        const maxDomRes = { dom: null, zIndex: 0 };
        list.forEach((dom) => {
          const { zIndex } = getComputedStyle(dom);

          if (!maxDomRes.dom) {
            Object.assign(maxDomRes, { dom, zIndex });
          } else {
            maxDomRes.zIndex < zIndex && Object.assign(maxDomRes, { dom, zIndex });
          }
        });

        const { display } = getComputedStyle(maxDomRes.dom);
        const { x, y, width, height } = maxDomRes.dom.getBoundingClientRect();
        const point = { x: x + width / 2, y: y + height / 2 };

        maxDomRes.dom.style.display = "none";

        requestAnimationFrame(() => {
          if (document.elementFromPoint(point.x, point.y) === document.body) {
            maxDomRes.dom.style.display = display;
          } else {
            document.body.removeChild(maxDomRes.dom);
          }
        });
      }

      const OCCUPY_SPACE = 0.95;
      const targetList = getAllTargetList();
      const topDom = [];
      const resDom = [];

      targetList.forEach(async (d) => {
        const { width, height, left, right, top, bottom, display } = getComputedStyle(d);

        const clientWidth = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight;
        const domWidth = width.replace("px", "");
        const domHeight = height.replace("px", "");

        let side = 0;
        if (right === "0px") side++;
        if (bottom === "0px") side++;
        if (left === "0px") side++;
        if (top === "0px") side++;

        // const rule0 = onCenter(d);
        const rule1 = side >= 2;
        const rule2 = Number((domWidth / clientWidth).toFixed(2)) > OCCUPY_SPACE;
        const rule3 = top !== "0px";
        const rule4 = d.parentElement === document.body;
        const rule5 = d.innerText.toLowerCase().includes("cookies");
        const rule6 = domWidth >= clientWidth;
        const rule7 = domHeight >= clientHeight;
        const rule8 = display === "none";

        if (rule8) {
          resDom.push(d);
        } else if (rule4 && rule5) {
          resDom.push(d);
        } else if ((rule1 || rule2) && rule3) {
          resDom.push(d);
        } else if (rule1 && rule6 && rule7 && (notAllMineFullScreen(d) || rule4)) {
          resDom.push(d);
        } else if (rule3) {
          const { y: y1 } = d.getBoundingClientRect();
          window.scrollBy(0, 10);
          requestAnimationFrame(() => {
            let { y: y2 } = d.getBoundingClientRect();
            y1 === y2 && resDom.push(d);
            window.scrollBy(0, -10);
          });
        } else if (rule4 && !rule3 && !rule7) {
          topDom.push(d);
        } else {
          console.log("unKill", d);
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
        killMaxZIndexTop(topDom);

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
