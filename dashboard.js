window.addEventListener("load", () => {

  const counters = document.querySelectorAll(".count");

  const duration = 2000;

  counters.forEach((el) => {

    const target = Number(el.getAttribute("data-target"));

    let startTime = null;

    function animate(timestamp) {

      if (!startTime) startTime = timestamp;

      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);

      const value = Math.floor(percent * target);

      el.innerText = value;

      if (percent < 1) {
        requestAnimationFrame(animate);
      } else {
        el.innerText = target;
      }

    }

    requestAnimationFrame(animate);

  });

});