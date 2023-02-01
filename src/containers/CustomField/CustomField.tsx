import Icon from "../../assets/customfield.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";

const CustomFieldExtension = () => {
  return (
    <div className="custom-field">
      <div className="custom-field-container">
        <div className="custom-field-icon">
          <img src={Icon} alt="icon" />
        </div>
        <div className="app-component-content">
          <h4>{localeTexts.CustomField.title}</h4>
          <p>{parse(localeTexts.CustomField.body)}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.contentstack.com/docs/developers/developer-hub/custom-field-location/">
            {localeTexts.CustomField.button.learnMore}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CustomFieldExtension;
