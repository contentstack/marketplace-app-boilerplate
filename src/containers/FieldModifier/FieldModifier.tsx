import Field_Modifier from "../../assets/Field_Modifier.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";

const FieldModifierExtension = () => {
  return (
    <div className="field-modifier">
      <div className="field-modifier-container">
        <div className="field-modifier-icon">
          <img src={Field_Modifier} alt="icon" />
        </div>
        <div className="field-modifier-component">
          <h4>{localeTexts.FieldModifier.title}</h4>
          <p>{parse(localeTexts.FieldModifier.body)}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.contentstack.com/docs/developers/developer-hub/field-modifier-location/">
            {localeTexts.FieldModifier.button.learnMore}
          </a>
        </div>
      </div>
    </div>
  );
};

export default FieldModifierExtension;
