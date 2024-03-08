// Global Helper Functions
const getCookieValue = (name) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

const createCookie = (name, data, stringify = false, expiry = 30) => {
  const expireTime = new Date();
  expireTime.setDate(expireTime.getDate() + expiry);

  document.cookie = `${name}=${encodeURIComponent(
    stringify ? JSON.stringify(data) : data
  )}; path=/; expires=${expireTime}`;
};

const loadScript = function (src, defer = false) {
  return new Promise((resolve) => {
    const scriptEl = document.createElement("script");
    if (defer) scriptEl.defer = true;
    else scriptEl.async = true;
    scriptEl.src = src;
    scriptEl.type = "text/javascript";

    document.body.appendChild(scriptEl);

    scriptEl.addEventListener("load", () => {
      resolve();
    });
  });
};

const loadStylesheet = function (href) {
  return new Promise((resolve) => {
    const sheetEl = document.createElement("link");
    sheetEl.href = href;
    sheetEl.rel = "stylesheet";

    document.body.appendChild(sheetEl);

    sheetEl.addEventListener("load", () => {
      resolve();
    });
  });
};

// Utilites
(() => {
  // Open the first FAQ
  document.querySelector(".main-faq-wrap")?.click();

  // Mirror Click
  document.querySelectorAll("[data-mirror-click=element]").forEach((el) => {
    el.addEventListener("click", () =>
      el.closest("div").querySelector("[data-mirror-click=target]").click()
    );
  });

  // Manage overflow
  (() => {
    const toggleOveflowTriggers = [];
    const hideOverflowTriggers = [];
    const unhideOverflowTriggers = [];

    const addTriggers = function (mainArr, newEls) {
      newEls.forEach((el) => mainArr.push(el));
    };

    // Toggle overfloe
    const toggleOverflow = () =>
      document.querySelector("body").classList.toggle("no-scroll");

    addTriggers(
      toggleOveflowTriggers,
      document.querySelectorAll(".overflow-hide")
    );

    toggleOveflowTriggers.forEach((el) =>
      el.addEventListener("click", toggleOverflow)
    );

    // Hide overflow
    const hideOverflow = () =>
      document.querySelector("body").classList.add("no-scroll");

    addTriggers(hideOverflowTriggers, [
      ...document.querySelectorAll(".open-apply-dev-form"),
      ...document.querySelectorAll(".open-hire-agency-form"),
      ...document.querySelectorAll(".hide-overflow"),
    ]);

    hideOverflowTriggers.forEach((el) =>
      el.addEventListener("click", hideOverflow)
    );

    // Unhide overflow
    const unhideOverflow = () =>
      document.querySelector("body").classList.remove("no-scroll");

    addTriggers(unhideOverflowTriggers, [
      ...document.querySelectorAll(".form-close-bg"),
      ...document.querySelectorAll(".close-popup-form"),
      ...document.querySelectorAll(".unhide-overflow"),
    ]);

    unhideOverflowTriggers.forEach((el) =>
      el.addEventListener("click", unhideOverflow)
    );
  })();

  // GDPR Consent
  (() => {
    const consent = getCookieValue("consent");
    if (consent) return;

    const cookieEl = document.querySelector(".cookie_bar-wrapper");
    if (!cookieEl) return;

    const acceptBtn = cookieEl.querySelector(".cookie_bar-btn");
    acceptBtn.addEventListener("click", () => {
      cookieEl.style.opacity = 0;
      setTimeout(() => cookieEl.remove(), 300);

      createCookie("consent", "true", false, 180);
    });

    cookieEl.style.display = "flex";
  })();
})();

/* Tracking & Typeforms */
// Global helper variables & functions
const customTrackData = { utm: {}, user: {} };

const updateInput = (inputArr, data) =>
  [...inputArr].forEach((input) => (input.value = data));

const URLParams = new URLSearchParams(location.search);

// User Tracking
(() => {
  // Get the UTM & store as cookie
  (() => {
    const utm_source = URLParams.get("utm_source");
    const utm_campaign = URLParams.get("utm_campaign");
    const utm_medium = URLParams.get("utm_medium");
    const utm_content = URLParams.get("utm_content");

    if (utm_source || utm_campaign || utm_medium || utm_content) {
      const utm_cookie_contact = {};

      utm_cookie_contact.utm_source = utm_source;
      utm_cookie_contact.utm_campaign = utm_campaign;
      utm_cookie_contact.utm_medium = utm_medium;
      utm_cookie_contact.utm_content = utm_content;

      createCookie("utm_cookie_contact", utm_cookie_contact, true);
    }
  })();

  // Get the UTM data from cookie, & pass to forms & the global object
  (() => {
    try {
      const utm_cookie_contact = getCookieValue("utm_cookie_contact");

      if (!utm_cookie_contact) return;

      const { utm_source, utm_campaign, utm_medium, utm_content } = JSON.parse(
        decodeURIComponent(utm_cookie_contact)
      );

      // Pass the data to Webflow form fields
      updateInput(document.querySelectorAll(".utm_source_input"), utm_source);
      updateInput(
        document.querySelectorAll(".utm_campaign_input"),
        utm_campaign
      );
      updateInput(document.querySelectorAll(".utm_medium_input"), utm_medium);
      updateInput(document.querySelectorAll(".utm_content_input"), utm_content);

      // Update the global tracking object
      customTrackData.utm = {
        utm_source,
        utm_campaign,
        utm_medium,
        utm_content,
      };
    } catch (err) {
      console.error(err);
    }
  })();

  // Track First page, Current page, Last page, ref parameter
  (() => {
    // Current page
    let current_page = location.href;
    updateInput(document.querySelectorAll(".current_page_name"), current_page);

    if (current_page === "/") current_page = "/home";

    customTrackData.current_page = current_page;

    // Last page
    try {
      let last_page = decodeURIComponent(getCookieValue("last_page"));

      if (!last_page) {
        last_page = URLParams.get("last_page");
      }

      if (last_page) {
        if (last_page === "/") last_page = "/home";

        updateInput(document.querySelectorAll(".last_page_name"), last_page);

        customTrackData.last_page = last_page;
      }

      // save current page as last page after using the last page value
      createCookie("last_page", current_page);
    } catch (err) {
      console.error(err);
    }

    // First page
    (() => {
      let first_page = decodeURIComponent(getCookieValue("first_page"));

      if (!first_page) {
        first_page = URLParams.get("first_page");

        if (!first_page) first_page = document.location.href;

        if (first_page === "/") first_page = "/home";

        createCookie("first_page", first_page);
      }

      updateInput(document.querySelectorAll(".first_page_name"), first_page);

      customTrackData.first_page = first_page;
    })();

    // Ref parameter
    (() => {
      // Store ref
      const ref = URLParams.get("ref");
      if (ref) createCookie("ref", ref);

      // Get ref
      let refCookie = getCookieValue("ref");
      if (!refCookie) return;
      try {
        refCookie = decodeURIComponent(refCookie);
        updateInput(document.querySelectorAll(".referral"), refCookie);
        customTrackData.ref = refCookie;
      } catch {
        console.log("error");
      }
    })();
  })();
})();

// Render Typeforms
document.addEventListener("DOMContentLoaded", async function () {
  const hireMicroLabBtns = document.querySelectorAll(
    ".open-v5-hire-microlab-form"
  );
  const hireTalentEmbedContainer = document.querySelector(".hire_form-embed");

  // Check if Typeform exists
  if (!hireMicroLabBtns.length && !hireTalentEmbedContainer) return;

  console.log("starting");

  await loadScript("https://embed.typeform.com/next/embed.js");
  await loadStylesheet("https://embed.typeform.com/next/css/popup.css");

  function getUTK() {
    const initialTime = +new Date();
    let timeout = 3500;

    if (window.innerWidth < 992) timeout = 6000;

    return new Promise(function promiseResolver(resolve, reject) {
      function checkUTK() {
        const currentTime = +new Date();
        if (currentTime - initialTime > timeout) return reject("");

        let utk = getCookieValue("hubspotutk");
        if (utk !== "") return resolve(utk);

        console.log("new timer");

        setTimeout(checkUTK, 100);
      }

      checkUTK();
    });
  }

  let hutk = getCookieValue("hubspotutk");

  if (hutk === "") {
    try {
      hutk = await getUTK();
    } catch {
      hutk = "";
    }
  }

  console.log("utk check ends", hutk);

  const options = {
    transitiveSearchParams: true,
    hubspot: true,
    hidden: {
      ...(hutk && { hubspot_utk: hutk }),
      shareGaInstance: true,
      utm_source: customTrackData.utm.utm_source
        ? customTrackData.utm.utm_source
        : "",
      utm_medium: customTrackData.utm.utm_medium
        ? customTrackData.utm.utm_medium
        : "",
      utm_campaign: customTrackData.utm.utm_campaign
        ? customTrackData.utm.utm_campaign
        : "",
      utm_term: "xxxx",
      utm_content: customTrackData.utm.utm_content
        ? customTrackData.utm.utm_content
        : "",
      hubspot_page_name: "xxxx",
      hubspot_page_url: "xxxx",
      status: "New",
      stage: "Lead",
      ctd_current_page: customTrackData.current_page
        ? customTrackData.current_page
        : "",
      ctd_last_page: customTrackData.last_page ? customTrackData.last_page : "",
      ctd_first_page: customTrackData.first_page
        ? customTrackData.first_page
        : "",
      ctd_ref: customTrackData.ref ? customTrackData.ref : "",
      lead_type: "microLab",
      is_microlab: "Yes",
    },
  };

  const staging = window.location.href.includes("staging") ? true : false;

  // Production forms
  const hireTalentFormID = "lfXFiIPt";
  let hireMicroLabFormID = "ZhiCTrlP";

  if (window.location.href.includes("microlab/visionpro"))
    hireMicroLabFormID = "BtvTlIEe";

  // Render talent inline widget
  (() => {
    if (!hireTalentEmbedContainer) return;

    // Validate Email
    window.tf.createWidget(hireTalentFormID, {
      container: hireTalentEmbedContainer,
      inlineOnMobile: true,
      height: "585",
      onReady: ({ formId }) => {
        const loader = document.querySelector("[data-form-loader]");
        loader.remove();

        hireTalentEmbedContainer.style.opacity = 1;
      },
      onSubmit: () => {
        document.location.href = `https://${
          staging ? "micro1-staging.webflow.io" : "www.micro1.ai"
        }/thank-you`;
      },
      ...options,
    });
  })();

  // Render microLab Popup
  (() => {
    if (!hireMicroLabBtns.length) return;

    const openForm = window.tf.createPopup(hireMicroLabFormID, {
      onSubmit: function () {
        document.location.href = `https://${
          staging ? "micro1-staging.webflow.io" : "www.micro1.ai"
        }/thank-you-microlab`;
      },
      onClose: function () {
        document.querySelector("body").classList.remove("no-scroll");
      },
      ...options,
    }).open;

    hireMicroLabBtns.forEach((btn) => {
      btn.addEventListener("click", openForm);
    });
  })();
});

// Track user contact info
document.addEventListener("DOMContentLoaded", function () {
  // Get user info from cookie
  (() => {
    const userContactInfoCookie = getCookieValue("userContactInfo");

    if (!userContactInfoCookie) return;

    const userContactInfo = JSON.parse(
      decodeURIComponent(userContactInfoCookie)
    );

    customTrackData.user = {
      first_name: userContactInfo.firstName,
      last_name: userContactInfo.lastName,
      email: userContactInfo.email,
    };
  })();

  // Format pages URLs
  let first_page, last_page;

  if (customTrackData.first_page) {
    first_page = document.createElement("a");
    first_page.href = customTrackData.first_page;
    first_page = first_page.pathname;

    if (first_page === "/") first_page = "/home";
  }
  if (customTrackData.current_page) {
    last_page = document.createElement("a");
    last_page.href = customTrackData.current_page;
    last_page = last_page.pathname;

    if (last_page === "/") last_page = "/home";
  }

  const currentPath = window.location.pathname;
  const { utm, user } = customTrackData;

  const paramsObj = {
    ...(utm.utm_campaign && { utm_campaign: utm.utm_campaign }),
    ...(utm.utm_medium && { utm_medium: utm.utm_medium }),
    ...(utm.utm_source && { utm_source: utm.utm_source }),
    ...(utm.utm_content && { utm_content: utm.utm_content }),
    ...(first_page && { first_page: first_page }),
    ...(last_page && { last_page: last_page }),
  };

  const addParamsToURLs = function (paramsObj, pathsArr) {
    const paramsStr = decodeURIComponent(
      new URLSearchParams(paramsObj).toString()
    );

    console.log(paramsStr);

    const links = [...document.querySelectorAll("a[href]")].filter((link) =>
      pathsArr.some((path) => link.href.includes(path))
    );

    links.forEach(
      (link) =>
        (link.href += link.href.includes("?")
          ? `&${paramsStr}`
          : `?${paramsStr}`)
    );

    return links;
  };

  // Add params to internal links
  (() => {
    const paths = ["/gpt-vetting-demo", "/hire", "/letter"];

    addParamsToURLs(paramsObj, paths);
  })();

  // Add params to portal links
  (() => {
    const paramsObjPortal = {
      ...paramsObj,
      ...(user.first_name && { first_name: user.first_name }),
      ...(user.last_name && { last_name: user.last_name }),
      ...(user.email && { email: user.email }),
      ...(currentPath.includes("search-talent-optional") && {
        meeting: "booked",
      }),
      source: currentPath.includes("gpt") ? "gpt-vetting" : "search-talent",
    };

    const paths = ["/register", "/login"];

    const portalLinks = addParamsToURLs(paramsObjPortal, paths);

    // Update portal link on staging
    if (window.location.host.includes("webflow.io")) {
      const livePortalHost = "www.client.micro1.ai";
      const stagingPortalHost = "dev.d1y3udqq47tapp.amplifyapp.com";

      portalLinks.forEach(
        (link) =>
          (link.href = link.href.replace(livePortalHost, stagingPortalHost))
      );
    }

    // Get user data from meeting form
    if (document.querySelector(".client-calendly-embed")) {
      window.addEventListener("message", (event) => {
        if (event.data.meetingBookSucceeded) {
          document.querySelector(
            ".meetings-iframe-container iframe"
          ).style.height = "auto";

          const { firstName, lastName, email } =
            event.data.meetingsPayload.bookingResponse.postResponse.contact;

          const userContactInfo = { firstName, lastName, email };

          createCookie("userContactInfo", userContactInfo, true);
        }
      });
    }
  })();
});
