import React, { useContext, useCallback } from "react";
 import _ from "lodash";
import { useDialog } from "../react/src/hooks/useDialog.tsx";
import WorkbookContext from "../react/src/context";
import Select, { Option } from "../react/src/components/Toolbar/Select.tsx";
import SVGIcon from "../react/src/components/SVGIcon.tsx";
 
const SubMenuOne: React.FC<{
      text: string;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ text, setOpen }) => {
// function SubMenuOne(text:string){
  const { context, setContext,refs } = useContext(WorkbookContext);
  const { showDialog } = useDialog();

  const showSubMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const target = e.target as HTMLDivElement;
      const menuItem =
        target.className === "fortune-toolbar-menu-line"
          ? target.parentElement!
          : target;
      const menuItemRect = menuItem.getBoundingClientRect();
      const workbookContainerRect =
        refs.workbookContainer.current!.getBoundingClientRect();
      const subMenu = menuItem.querySelector(
        ".condition-format-sub-menu"
      ) as HTMLDivElement;
      if (_.isNil(subMenu)) return;
      const menuItemStyle = window.getComputedStyle(menuItem);
      const menuItemPaddingRight = parseFloat(
        menuItemStyle.getPropertyValue("padding-right").replace("px", "")
      );

      if (
        workbookContainerRect.right - menuItemRect.right <
        parseFloat(subMenu.style.width.replace("px", ""))
      ) {
        subMenu.style.display = "block";
        subMenu.style.right = `${menuItemRect.width - menuItemPaddingRight}px`;
      } else {
        subMenu.style.display = "block";
        subMenu.style.right = `${-(
          parseFloat(subMenu.style.width.replace("px", "")) +
          menuItemPaddingRight
        )}px`;
      }
    },
    [refs.workbookContainer]
  );

  const hideSubMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const target = e.target as HTMLDivElement;

      if (target.className === "condition-format-sub-menu") {
        target.style.display = "none";
        return;
      }

      const subMenu = (
        target.className === "condition-format-item"
          ? target.parentElement
          : target.querySelector(".condition-format-sub-menu")
      ) as HTMLDivElement;
      if (_.isNil(subMenu)) return;
      subMenu.style.display = "none";
    },
    []
  );
        return (
          <Option
          key={text}
            onMouseEnter={showSubMenu}
            onMouseLeave={hideSubMenu}
          >
            <div className="fortune-toolbar-menu-line" key={`div${text}`}>
            {text}
             <SVGIcon name="rightArrow" width={18} />
              <div
                className="condition-format-sub-menu"
                style={{
                  display: "none",
                  width: 150,
                }}
              >
                {[
                  { text: "greaterThan", value: ">" },
                  { text: "lessThan", value: "<" },
                  { text: "between", value: "[]" },
                  { text: "equal", value: "=" },
                  { text: "textContains", value: "()" },
                  { text: "duplicateValue", value: "##" },
                ].map((v) => (
                  <div
                    className="condition-format-item"
                    key={v.text}
                    onClick={() => {
                        setOpen(false);
                      showDialog("sdfs","ok");
                    }}
                    tabIndex={0}
                  >
                  {v.text}
                  </div>
                ))}
              </div>
            </div>
          </Option>
        );

}

export default SubMenuOne;
