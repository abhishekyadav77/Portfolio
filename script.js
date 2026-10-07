const D = DATA;
const $ = id => document.getElementById(id);

/* =========================
   HELPERS
========================= */

function el(tag, props = {}, kids = []) {
  const e = document.createElement(tag);

  Object.entries(props).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;

    if (k === "text") {
      e.textContent = v;
    } else {
      e.setAttribute(k, v);
    }
  });

  kids.forEach(k => e.append(k));

  return e;
}

function icon(path) {
  const wrap = document.createElement("span");

  wrap.innerHTML =
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;

  return wrap.firstChild;
}

const ICONS = {
  email:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',

  phone:
    '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',

  education:
    '<path d="M2 10l10-5 10 5-10 5L2 10z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/><path d="M22 10v6"/>',

  location:
    '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',

  copy:
    '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',

  github:
    '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',

  linkedin:
    '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v5M8 8v.01M12 16v-5m0 2c0-1.7 1-2 2-2s2 .6 2 2v3"/>',

  leetcode:
    '<path d="m15 4-9 9a3 3 0 0 0 0 4l1 1a3 3 0 0 0 4 0l3-3M10 13h10"/>',

  link:
    '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',

  sun:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',

  moon:
    '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>'
};

/* =========================
   TOAST
========================= */

let toastTimer;

function toast(message) {
  const t = $("toast");

  if (!t) return;

  t.textContent = message;
  t.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    t.classList.remove("show");
  }, 2200);
}

/* =========================
   PROFILE
========================= */

document.title = D.siteTitle || D.name;

$("avatar").src = D.avatar;
$("avatar").alt = D.name;

$("name").textContent = D.name;
$("role").textContent = D.title;

/*
  Sidebar contact information.

  Important:
  D.education is an ARRAY used by the Resume section.
  Therefore we do not use D.education directly here.
*/

const sidebarContacts = [
  ["Email", "email", D.email, "mailto:" + D.email, true],

  [
    "Phone",
    "phone",
    D.phone,
    "tel:" + String(D.phone).replace(/\s/g, "")
  ],

  [
    "Education",
    "education",
    "B.Tech CSE • AKTU"
  ],

  [
    "Location",
    "location",
    D.location
  ]
];

sidebarContacts.forEach(([label, key, value, href, copyable]) => {
  const text = el("div", { class: "txt" }, [
    el("small", { text: label }),

    href
      ? el("a", {
          href,
          text: value
        })
      : el("span", {
          class: "v",
          text: value
        })
  ]);

  const item = el("li", {}, [
    el(
      "span",
      {
        class: "ico"
      },
      [icon(ICONS[key])]
    ),
    text
  ]);

  if (copyable) {
    const btn = el(
      "button",
      {
        class: "copy",
        type: "button",
        "aria-label": "Copy email address"
      },
      [icon(ICONS.copy)]
    );

    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(value);

        toast("Email copied");
      } catch {
        toast("Copy failed. Select the email and copy it manually.");
      }
    });

    item.append(btn);
  }

  $("contacts").append(item);
});

/* =========================
   SOCIAL LINKS
========================= */

D.socials.forEach(s => {
  const key = s.label.toLowerCase();

  $("socials").append(
    el("li", {}, [
      el(
        "a",
        {
          href: s.url,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": s.label
        },
        [
          icon(ICONS[key] || ICONS.link),
          document.createTextNode(s.label)
        ]
      )
    ])
  );
});

/* =========================
   ABOUT
========================= */

$("tagline").textContent = D.tagline || D.title;

if (D.status) {
  $("status").querySelector("span").textContent = D.status;
} else {
  $("status").remove();
}

D.about.forEach(p => {
  $("about-text").append(
    el("p", {
      text: p
    })
  );
});

D.services.forEach(s => {
  $("services").append(
    el("li", {}, [
      el("h4", {
        text: s.title
      }),

      el("p", {
        text: s.text
      })
    ])
  );
});

/* =========================
   RESUME
========================= */

function timeline(id, items) {
  const box = $(id);

  if (!box || !items) return;

  items.forEach(i => {
    const parts = [
      el("h4", {
        text: i.title
      })
    ];

    if (i.period) {
      parts.push(
        el("span", {
          text: i.period
        })
      );
    }

    parts.push(
      el("p", {
        text: i.text
      })
    );

    if (i.link) {
      parts.push(
        el("a", {
          class: "certificate-link",
          href: i.link,
          target: "_blank",
          rel: "noopener noreferrer",
          text: "View certificate"
        })
      );
    }

    box.append(
      el("li", {}, parts)
    );
  });
}

["education", "experience", "training", "certifications"].forEach(k => {
  timeline(k, D[k]);
});

/* =========================
   SKILLS
========================= */

D.skills.forEach(s => {
  const fill = el("i", {
    "data-value": s.value
  });

  $("skills").append(
    el("li", {}, [
      el("div", {
        class: "top"
      }, [
        el("span", {
          text: s.name
        }),

        el("span", {
          text: s.value + "%"
        })
      ]),

      el("div", {
        class: "bar",
        role: "img",
        "aria-label": `${s.name}, ${s.value} percent`
      }, [
        fill
      ])
    ])
  );
});

function animateSkills() {
  document.querySelectorAll(".bar i").forEach(bar => {
    bar.style.width = "0";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = bar.dataset.value + "%";
      });
    });
  });
}

/* =========================
   PROJECTS
========================= */

const categories = [
  "All",
  ...new Set(D.projects.map(p => p.category))
];

function projectCard(p) {
  const building = p.status === "Building";

  const preview = el("div", {
    class: "project-preview"
  });

  const placeholder = () =>
    el("div", {
      class:
        "project-placeholder" +
        (building ? " soon" : ""),
      text: building
        ? "Coming soon"
        : p.title.charAt(0)
    });

  /* Project image */

  if (p.image) {
    const img = el("img", {
      src: p.image,
      alt: p.title,
      loading: "lazy"
    });

    img.addEventListener("error", () => {
      img.replaceWith(placeholder());
    });

    preview.append(img);
  } else {
    preview.append(placeholder());
  }

  /* Status */

  const status = el(
    "span",
    {
      class:
        "project-status" +
        (building ? " building" : "")
    },
    [
      el("i", {
        class: "status-dot"
      }),

      document.createTextNode(p.status)
    ]
  );

  /* Project body */

  const body = el(
    "div",
    {
      class: "project-body"
    },
    [
      el(
        "div",
        {
          class: "project-title-row"
        },
        [
          el("h4", {
            text: p.title
          }),

          status
        ]
      ),

      el("small", {
        class: "project-category",
        text: p.category
      }),

      el("p", {
        class: "project-description",
        text: p.description || ""
      })
    ]
  );

  /* Technologies */

  if (p.tech && p.tech.length) {
    body.append(
      el(
        "ul",
        {
          class: "tech",
          "aria-label": "Technologies"
        },
        p.tech.map(t =>
          el("li", {
            text: t
          })
        )
      )
    );
  }

  /* =========================
     PROJECT ACTIONS
  ========================= */

  const actions = el("div", {
    class: "project-actions"
  });

  /* Live Demo */

  if (p.live && !building) {
    const liveButton = el(
      "a",
      {
        class: "project-btn live-btn",
        href: p.live,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `View live demo of ${p.title}`
      },
      [
        icon(ICONS.link),
        document.createTextNode("Live Demo")
      ]
    );

    liveButton.addEventListener("click", e => {
      e.stopPropagation();
    });

    actions.append(liveButton);
  }

  /* GitHub */

  if (p.github) {
    const githubButton = el(
      "a",
      {
        class: "project-btn github-btn",
        href: p.github,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `View ${p.title} on GitHub`
      },
      [
        icon(ICONS.github),
        document.createTextNode("GitHub")
      ]
    );

    githubButton.addEventListener("click", e => {
      e.stopPropagation();
    });

    actions.append(githubButton);
  }

  /* Building project */

  if (building && !p.github) {
    actions.append(
      el("span", {
        class: "view-project",
        text: "In progress"
      })
    );
  }

  if (actions.children.length) {
    body.append(actions);
  }

  /*
    IMPORTANT:
    The entire project card is now a normal div.
    Live Demo and GitHub are separate links.
  */

  const card = el(
    "div",
    {
      class: "project-card"
    },
    [
      preview,
      body
    ]
  );

  return el("li", {}, [card]);
}

function showProjects(category) {
  $("projects").replaceChildren(
    ...D.projects
      .filter(
        p =>
          category === "All" ||
          p.category === category
      )
      .map(projectCard)
  );

  [...$("filters").children].forEach(b => {
    b.setAttribute(
      "aria-pressed",
      String(b.textContent === category)
    );
  });
}

categories.forEach(c => {
  $("filters").append(
    el("button", {
      type: "button",
      text: c
    })
  );
});

$("filters").addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    showProjects(e.target.textContent);
  }
});

showProjects("All");

/* =========================
   BLOG
========================= */

function renderBlogs() {
  const box = $("blog-coming-soon");

  if (!Array.isArray(D.blogs) || !D.blogs.length) {
    box.append(
      el(
        "div",
        {
          class: "blog-coming-card"
        },
        [
          el("h3", {
            text: "Blog coming soon"
          }),

          el("p", {
            text:
              "I'm working on my first posts. Check back soon."
          })
        ]
      )
    );

    return;
  }

  D.blogs.forEach(b => {
    const card = el(
      "article",
      {
        class: "blog-ready"
      },
      [
        el("span", {
          class: "blog-status",
          text: b.status || "Live"
        }),

        el("h3", {
          text: b.title
        }),

        el("p", {
          text: b.text
        })
      ]
    );

    if (b.link) {
      card.append(
        el("a", {
          href: b.link,
          target: "_blank",
          rel: "noopener noreferrer",
          text: "Read article"
        })
      );
    }

    box.append(card);
  });
}

renderBlogs();

/* =========================
   NAVIGATION
========================= */

const tabs = [
  ...document.querySelectorAll("#nav button")
];

const pages = [
  ...document.querySelectorAll(".page")
];

const valid = tabs.map(t => t.dataset.page);

function go(page, push = true) {
  if (!valid.includes(page)) {
    page = "about";
  }

  tabs.forEach(t => {
    const on = t.dataset.page === page;

    t.setAttribute(
      "aria-selected",
      String(on)
    );

    t.tabIndex = on ? 0 : -1;
  });

  pages.forEach(p => {
    p.classList.toggle(
      "active",
      p.dataset.page === page
    );
  });

  if (
    push &&
    location.hash !== "#" + page
  ) {
    history.pushState(
      null,
      "",
      "#" + page
    );
  }

  if (page === "resume") {
    animateSkills();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

$("nav").addEventListener("click", e => {
  const t = e.target.closest("button");

  if (t) {
    go(t.dataset.page);
  }
});

$("nav").addEventListener("keydown", e => {
  if (
    e.key !== "ArrowRight" &&
    e.key !== "ArrowLeft"
  ) {
    return;
  }

  const i = tabs.findIndex(
    t =>
      t.getAttribute("aria-selected") ===
      "true"
  );

  const next =
    tabs[
      (i +
        (e.key === "ArrowRight"
          ? 1
          : tabs.length - 1)) %
        tabs.length
    ];

  go(next.dataset.page);
  next.focus();
});

document
  .querySelectorAll("[data-go]")
  .forEach(b =>
    b.addEventListener("click", () =>
      go(b.dataset.go)
    )
  );

window.addEventListener("popstate", () =>
  go(location.hash.slice(1), false)
);

go(
  location.hash.slice(1) || "about",
  false
);

window.scrollTo(0, 0);

/* =========================
   MOBILE CONTACTS
========================= */

$("toggle").addEventListener("click", () => {
  const open =
    $("more").classList.toggle("open");

  $("toggle").setAttribute(
    "aria-expanded",
    String(open)
  );

  $("toggle").textContent = open
    ? "Hide contacts"
    : "Show contacts";
});

/* =========================
   THEME
========================= */

function setTheme(theme, save = true) {
  document.documentElement.dataset.theme =
    theme;

  const next =
    theme === "dark"
      ? "light"
      : "dark";

  const btn = $("theme");

  btn.replaceChildren(
    icon(
      theme === "dark"
        ? ICONS.sun
        : ICONS.moon
    )
  );

  btn.setAttribute(
    "aria-label",
    `Switch to ${next} theme`
  );

  const themeMeta =
    document.querySelector(
      'meta[name="theme-color"]'
    );

  if (themeMeta) {
    themeMeta.content =
      theme === "dark"
        ? "#0e1013"
        : "#f4f5f7";
  }

  if (save) {
    try {
      localStorage.setItem(
        "theme",
        theme
      );
    } catch (e) {}
  }
}

setTheme(
  document.documentElement.dataset.theme ||
    "dark",
  false
);

$("theme").addEventListener(
  "click",
  () => {
    setTheme(
      document.documentElement.dataset.theme ===
        "dark"
        ? "light"
        : "dark"
    );
  }
);

/* =========================
   CONTACT FORM
========================= */

const contactForm = $("form");

if (contactForm) {
  contactForm.addEventListener(
    "submit",
    e => {
      e.preventDefault();

      const form = e.target;
      const data = new FormData(form);

      const name = String(
        data.get("name") || ""
      ).trim();

      const email = String(
        data.get("email") || ""
      ).trim();

      const message = String(
        data.get("message") || ""
      ).trim();

      const error = $("form-error");

      /* Remove previous errors */

      form
        .querySelectorAll(
          "input, textarea"
        )
        .forEach(field =>
          field.classList.remove(
            "invalid"
          )
        );

      if (error) {
        error.textContent = "";
      }

      /* Validation */

      let problem = null;

      if (!name) {
        problem = [
          "name",
          "Please enter your name."
        ];
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email
        )
      ) {
        problem = [
          "email",
          "Please enter a valid email address."
        ];
      } else if (!message) {
        problem = [
          "message",
          "Please write a message."
        ];
      }

      if (problem) {
        const field =
          form.elements[problem[0]];

        if (field) {
          field.classList.add(
            "invalid"
          );
          field.focus();
        }

        if (error) {
          error.textContent =
            problem[1];
        }

        return;
      }

      /*
        Build email.

        This does NOT require a backend.
        It opens the visitor's default
        email application.
      */

      const subject =
        `Portfolio Contact - ${name}`;

      const body =
        `Hello Abhishek,

${message}

------------------------------
Sender Details
------------------------------
Name: ${name}
Email: ${email}
`;

      const mailto =
        `mailto:${D.contactEmail}` +
        `?subject=${encodeURIComponent(
          subject
        )}` +
        `&body=${encodeURIComponent(
          body
        )}`;

      toast(
        "Opening your email application..."
      );

      setTimeout(() => {
        window.location.href = mailto;
      }, 250);
    }
  );
}