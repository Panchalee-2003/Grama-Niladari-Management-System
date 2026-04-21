import { useTranslation } from "react-i18next";
import "../styles/languageSwitcher.css";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("si") ? "si" : "en";

  const toggle = () => {
    i18n.changeLanguage(current === "en" ? "si" : "en");
  };

  return (
    <button
      className="lang-switcher"
      onClick={toggle}
      title={current === "en" ? "Switch to Sinhala" : "Switch to English"}
      aria-label="Toggle language"
    >
      <span className={`lang-option ${current === "en" ? "lang-active" : ""}`}>
        EN
      </span>
      <span className="lang-divider">|</span>
      <span className={`lang-option ${current === "si" ? "lang-active" : ""}`}>
        සිං
      </span>
    </button>
  );
}
