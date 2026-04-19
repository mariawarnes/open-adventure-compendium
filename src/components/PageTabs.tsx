import type {
  AdventureCharacter,
  AdventureEncounter,
  AdventureLocation,
} from "@/utils/sanity/types";
import { useEffect, useState } from "react";

interface PageSection {
  id: string;
  list: AdventureEncounter[] | AdventureLocation[] | AdventureCharacter[];
  title: string;
}

const PageTabs = ({ sections }: { sections: PageSection[] }) => {
  const [activeTab, setActiveTab] = useState(sections[0]);

  function getActiveTab() {
    const tabsBottom =
      document.getElementById("adventure-tabs")?.getBoundingClientRect()
        .bottom + 20;

    const scrolledPast = sections.filter(
      (section) =>
        (document.getElementById(section.id)?.getBoundingClientRect().top ??
          0) <= (tabsBottom ?? 0),
    );
    return scrolledPast[scrolledPast.length - 1] ?? sections[0];
  }

  useEffect(() => {
    const handleScroll = () => {
      // Perform actions on window resize
      setActiveTab(getActiveTab());
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Perform actions on window resize
      setActiveTab(getActiveTab());
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      id="adventure-tabs"
      role="tablist"
      className="tabs tabs-box sticky top-0 z-10 lg:hidden"
    >
      {sections.map((section) => (
        <a
          role="tab"
          key={section.id}
          className={`tab ${activeTab.id == section.id ? "active-tab" : ""}`}
          onClick={() => setActiveTab(section)}
          href={`#${section.id}`}
          aria-selected={activeTab.id == section.id ? "true" : "false"}
        >
          {section.title}
        </a>
      ))}
    </div>
  );
};

export default PageTabs;
