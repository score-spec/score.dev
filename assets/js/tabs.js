const tabs = document.querySelectorAll(".tab");
const tabPanes = document.querySelectorAll(".tab-pane");

const activateTab = (tab) => {
  tab.classList.add("tab-active");
  const innerHTML = tab.innerHTML;
  tabPanes.forEach((tabPane) => {
    if (tabPane.getAttribute("aria-labelledby") === innerHTML.trim()) {
      tabPane.classList.add("tab-pane-active");
    }
  });
};

const deactivateTab = (tab) => {
  tab.classList.remove("tab-active");
  const innerHTML = tab.innerHTML;
  tabPanes.forEach((tabPane) => {
    if (tabPane.getAttribute("aria-labelledby") === innerHTML.trim()) {
      tabPane.classList.remove("tab-pane-active");
    }
  });
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const innerHTML = tab.innerHTML;
    tabs.forEach((tab) => {
      if (tab.innerHTML === innerHTML) {
        activateTab(tab);
      } else {
        deactivateTab(tab);
      }
    });
  });

  // Check if all tab panels have an active tab. If not, add active to the first tab
  const activeTabs = document.querySelectorAll(".tab-group");
  activeTabs.forEach((activeTab) => {
    const hasActiveTab = activeTab.querySelector(".tab-active");
    if (!hasActiveTab) {
      const firstTab = activeTab.querySelector(".tab");
      activateTab(firstTab);
    }
  });
});
