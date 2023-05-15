import Icon from "../../assets/fullscreen.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";

const FullPageExtension = () => {
  return (
    <div className="full-page">
      <div className="full-page-container">
        <div className="full-page-icon">
          <img src={Icon} alt="icon" />
        </div>
        <div className="app-component-content">
          <h4>{localeTexts.FullPage.title}</h4>
          <p>{parse(localeTexts.FullPage.body)}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.contentstack.com/docs/developers/developer-hub/full-page-location/">
            {localeTexts.FullPage.button.learnMore}
          </a>
        </div>
      </div>
    </div>
  );
};
export default FullPageExtension;
