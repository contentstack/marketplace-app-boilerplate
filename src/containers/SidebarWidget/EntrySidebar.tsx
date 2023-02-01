import Icon from "../../assets/sidebarwidget.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";

const EntrySidebarExtension = () => {
  return (
    <div className="entry-sidebar">
      <div className="entry-sidebar-container">
        <div className="entry-sidebar-icon">
          <img src={Icon} alt="icon" />
        </div>
        <div className="app-component-content">
          <h4>{localeTexts.SidebarWidget.title}</h4>
          <p>{parse(localeTexts.SidebarWidget.body)}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.contentstack.com/docs/developers/developer-hub/sidebar-location/">
            {localeTexts.SidebarWidget.button.learnMore}
          </a>
        </div>
      </div>
    </div>
  );
};

export default EntrySidebarExtension;
