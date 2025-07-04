import React, {
  useContext,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  toolbarItemClickHandler,
  // handleTextBackground,
  // handleTextColor,
  // handleTextSize,
  normalizedCellAttr,
  getFlowdata,
  // newComment,
  // editComment,
  // deleteComment,
  // showHideComment,
  // showHideAllComments,
  autoSelectionFormula,
  handleSum,
  locale,
  // handleMerge,
  handleBorder,
  toolbarItemSelectedFunc,
  handleFreeze,
  // insertImage,
  // showImgChooser,
  updateFormat,
  handleSort,
  // handleHorizontalAlign,
  // handleVerticalAlign,
  // handleScreenShot,
  // createFilter,
  // clearFilter,
  // applyLocation,
} from "../../../../core";
import _ from "lodash";
import WorkbookContext from "../../context";
import "./index.css";
import Button from "./Button";
import Divider, { MenuDivider } from "./Divider";
import Combo from "./Combo";
import Select, { Option } from "./Select";
import SVGIcon from "../SVGIcon";
import { useDialog } from "../../hooks/useDialog";
import { FormulaSearch } from "../FormulaSearch";
// import { SplitColumn } from "../SplitColumn";
// import { LocationCondition } from "../LocationCondition";
// import DataVerification from "../DataVerification";
// import ConditionalFormat from "../ConditionFormat";
import CustomButton from "./CustomButton";
// import { CustomColor } from "./CustomColor";
// import CustomBorder from "./CustomBorder";
// import { FormatSearch } from "../FormatSearch";
import DownloadCSVButton from "../../../../mine/downloadCSV.tsx";
import DownloadJsonButton from "../../../../mine/downloadJSON.tsx";
import LoadButton from "../../../../mine/loadFiles.tsx";
import MyMenu from "../../../../mine/menu.tsx";
import About from "../../../../mine/about.tsx";
import MyPlotMenu from "../../../../mine/plotMenu.tsx";
import History from "../../../../mine/history.tsx";

const Toolbar: React.FC<{
  setMoreItems: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  moreItemsOpen: boolean;
}> = ({ setMoreItems, moreItemsOpen }) => {
  const { context, setContext, refs, settings, handleUndo, handleRedo } =
    useContext(WorkbookContext);
  const contextRef = useRef(context);
  const containerRef = useRef<HTMLDivElement>(null);
  const [toolbarWrapIndex, setToolbarWrapIndex] = useState(-1); // -1 means pending for item location calculation
  const [itemLocations, setItemLocations] = useState<number[]>([]);
  const { showDialog, hideDialog } = useDialog();
  const firstSelection = context.luckysheet_select_save?.[0];
  const flowdata = getFlowdata(context);
  contextRef.current = context;
  const row = firstSelection?.row_focus;

  const col = firstSelection?.column_focus;
  const cell =
    flowdata && row != null && col != null ? flowdata?.[row]?.[col] : undefined;
  const {
    toolbar,
    merge,
    border,
    freezen,
    defaultFmt,
    formula,
    sort,
    align,
    textWrap,
    rotation,
    screenshot,
    filter,
    splitText,
    findAndReplace,
    comment,
    fontarray,
  } = locale(context);
  const toolbarFormat = locale(context).format;
  const sheetWidth = context.luckysheetTableContentHW[0];
  const { currency } = settings;
  const defaultFormat = defaultFmt(currency);

  const [customColor, setcustomColor] = useState("#000000");
  const [customStyle, setcustomStyle] = useState("1");

  const showSubMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, className: string) => {
      const target = e.target as HTMLDivElement;
      const menuItem =
        target.className === "fortune-toolbar-menu-line"
          ? target.parentElement!
          : target;
      const menuItemRect = menuItem.getBoundingClientRect();
      const workbookContainerRect =
        refs.workbookContainer.current!.getBoundingClientRect();
      const subMenu = menuItem.querySelector(`.${className}`) as HTMLDivElement;
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
        subMenu.style.right =
          className === "more-format"
            ? `${-(parseFloat(subMenu.style.width.replace("px", "")) + 0)}px`
            : `${-(
                parseFloat(subMenu.style.width.replace("px", "")) +
                menuItemPaddingRight
              )}px`;
      }
    },
    [refs.workbookContainer]
  );

  const hideSubMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, className: string) => {
      const target = e.target as HTMLDivElement;

      if (target.className === `${className}`) {
        target.style.display = "none";
        return;
      }

      const subMenu = (
        target.className === "condition-format-item"
          ? target.parentElement
          : target.querySelector(`.${className}`)
      ) as HTMLDivElement;
      if (_.isNil(subMenu)) return;
      subMenu.style.display = "none";
    },
    []
  );

  // rerenders the entire toolbar and trigger recalculation of item locations
  useEffect(() => {
    setToolbarWrapIndex(-1);
  }, [settings.toolbarItems, settings.customToolbarItems]);

  // recalculate item locations
  useEffect(() => {
    if (toolbarWrapIndex === -1) {
      const container = containerRef.current!;
      if (!container) return;
      const items = container.querySelectorAll(".fortune-toolbar-item");
      if (!items) return;
      const locations: number[] = [];
      const containerRect = container.getBoundingClientRect();
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i] as HTMLElement;
        const itemRect = item.getBoundingClientRect();
        locations.push(itemRect.left - containerRect.left + itemRect.width);
      }
      setItemLocations(locations);
    }
  }, [toolbarWrapIndex, sheetWidth]);

  // calculate the position after which items should be wrapped
  useEffect(() => {
    if (itemLocations.length === 0) return;
    const container = containerRef.current!;
    if (!container) return;
    const moreButtonWidth = 50;
    for (let i = itemLocations.length - 1; i >= 0; i -= 1) {
      const loc = itemLocations[i];
      if (loc + moreButtonWidth < container.clientWidth) {
        setToolbarWrapIndex(
          i - itemLocations.length + settings.toolbarItems.length
        );
        if (i === itemLocations.length - 1) {
          setMoreItems(null);
        }
        break;
      }
    }
  }, [itemLocations, setMoreItems, settings.toolbarItems.length, sheetWidth]);

  const getToolbarItem = useCallback(
    (name: string, i: number) => {
      // @ts-ignore
      const tooltip = toolbar[name];
      if (name === "|") {
        return <Divider key={i} />;
      }
      if (name === "history"){
          return <History />
      }
      if (name === "about") {
        return <About />;
      }
      if (name === "menu") {
        return <MyMenu />;
      }
      if (name === "plotmenu") {
        return <MyPlotMenu />;
      }
      if (name === "load") {
        return <LoadButton />;
      }
      if (name === "save") {
        return <DownloadJsonButton />;
      }
      if (name === "download") {
        return <DownloadCSVButton />;
      }
      if (name === "undo") {
        return (
          <Button
            iconId={name}
            tooltip={tooltip}
            key={name}
            disabled={refs.globalCache.undoList.length === 0}
            onClick={() => handleUndo()}
          />
        );
      }
      if (name === "redo") {
        return (
          <Button
            iconId={name}
            tooltip={tooltip}
            key={name}
            disabled={refs.globalCache.redoList.length === 0}
            onClick={() => handleRedo()}
          />
        );
      }
      if (name === "freeze") {
        const items = [
          {
            text: freezen.freezenRowRange,
            value: "freeze-row",
          },
          {
            text: freezen.freezenColumnRange,
            value: "freeze-col",
          },
          {
            text: freezen.freezenRCRange,
            value: "freeze-row-col",
          },
          {
            text: freezen.freezenCancel,
            value: "freeze-cancel",
          },
        ];
        return (
          <Combo
            iconId="freeze-row-col"
            key={name}
            tooltip={tooltip}
            onClick={() =>
              setContext((ctx) => {
                handleFreeze(ctx, "freeze-row-col");
              })
            }
          >
            {(setOpen) => (
              <Select>
                {items.map(({ text, value }) => (
                  <Option
                    key={value}
                    onClick={() => {
                      setContext((ctx) => {
                        handleFreeze(ctx, value);
                      });
                      setOpen(false);
                    }}
                  >
                    <div className="fortune-toolbar-menu-line">
                      {text}
                      <SVGIcon name={value} />
                    </div>
                  </Option>
                ))}
              </Select>
            )}
          </Combo>
        );
      }
      if (name === "text-wrap") {
        const items = [
          {
            text: textWrap.clip,
            iconId: "text-clip",
            value: "clip",
          },
          {
            text: textWrap.overflow,
            iconId: "text-overflow",
            value: "overflow",
          },
          {
            text: textWrap.wrap,
            iconId: "text-wrap",
            value: "wrap",
          },
        ];
        let curr = items[0];
        if (cell?.tb != null) {
          curr = _.get(items, cell.tb);
        }
        return (
          <Combo iconId={curr.iconId} key={name} tooltip={toolbar.textWrap}>
            {(setOpen) => (
              <Select>
                {items.map(({ text, iconId, value }) => (
                  <Option
                    key={value}
                    onClick={() => {
                      setContext((ctx) => {
                        const d = getFlowdata(ctx);
                        if (d == null) return;
                        updateFormat(
                          ctx,
                          refs.cellInput.current!,
                          d,
                          "tb",
                          value
                        );
                      });
                      setOpen(false);
                    }}
                  >
                    <div className="fortune-toolbar-menu-line">
                      {text}
                      <SVGIcon name={iconId} />
                    </div>
                  </Option>
                ))}
              </Select>
            )}
          </Combo>
        );
      }
      if (name === "filter") {
        const items = [
          {
            iconId: "sort-asc",
            value: "sort-asc",
            text: sort.asc,
            onClick: () => {
              setContext((ctx) => {
                handleSort(ctx, true);
              });
            },
          },
          {
            iconId: "sort-desc",
            value: "sort-desc",
            text: sort.desc,
            onClick: () => {
              setContext((ctx) => {
                handleSort(ctx, false);
              });
            },
          },
          // { iconId: "sort", value: "sort", text: sort.custom },
          // { iconId: "", value: "divider" },
          // {
          //   iconId: "filter1",
          //   value: "filter",
          //   text: filter.filter,
          //   onClick: () =>
          //     setContext((draftCtx) => {
          //       createFilter(draftCtx);
          //     }),
          // },
          // {
          //   iconId: "eraser",
          //   value: "eraser",
          //   text: filter.clearFilter,
          //   onClick: () =>
          //     setContext((draftCtx) => {
          //       clearFilter(draftCtx);
          //     }),
          // },
        ];
        return (
          <Combo iconId="filter" key={name} tooltip="Sort">
            {(setOpen) => (
              <Select>
                {items.map(({ text, iconId, value, onClick }, index) =>
                  value !== "divider" ? (
                    <Option
                      key={value}
                      onClick={() => {
                        onClick?.();
                        setOpen(false);
                      }}
                    >
                      <div className="fortune-toolbar-menu-line">
                        {text}
                        <SVGIcon name={iconId} />
                      </div>
                    </Option>
                  ) : (
                    <MenuDivider key={`divider-${index}`} />
                  )
                )}
              </Select>
            )}
          </Combo>
        );
      }
      return (
        <Button
          iconId={name}
          tooltip={tooltip}
          key={name}
          selected={toolbarItemSelectedFunc(name)?.(cell)}
          onClick={() =>
            setContext((draftCtx) => {
              toolbarItemClickHandler(name)?.(
                draftCtx,
                refs.cellInput.current!,
                refs.globalCache
              );
            })
          }
        />
      );
    },
    [
      toolbar,
      cell,
      setContext,
      refs.cellInput,
      refs.fxInput,
      refs.globalCache,
      defaultFormat,
      align,
      handleUndo,
      handleRedo,
      flowdata,
      formula,
      showDialog,
      hideDialog,
      merge,
      border,
      freezen,
      screenshot,
      sort,
      textWrap,
      rotation,
      filter,
      splitText,
      findAndReplace,
      context.luckysheet_select_save,
      context.defaultFontSize,
      context.allowEdit,
      comment,
      fontarray,
      hideSubMenu,
      showSubMenu,
      refs.canvas,
      customColor,
      customStyle,
      toolbarFormat.moreCurrency,
      toolbarFormat.moreNumber,
    ]
  );

  return (
    <header>
      <div
        ref={containerRef}
        className="fortune-toolbar"
        role="toolbar"
        aria-label={toolbar.toolbar}
      >
        {settings.customToolbarItems.map((n) => {
          return (
            <CustomButton
              tooltip={n.tooltip}
              onClick={n.onClick}
              key={n.key}
              icon={n.icon}
              iconName={n.iconName}
            >
              {n.children}
            </CustomButton>
          );
        })}
        {settings.customToolbarItems?.length > 0 ? (
          <Divider key="customDivider" />
        ) : null}
        {(toolbarWrapIndex === -1
          ? settings.toolbarItems
          : settings.toolbarItems.slice(0, toolbarWrapIndex + 1)
        ).map((name, i) => getToolbarItem(name, i))}
        {toolbarWrapIndex !== -1 &&
        toolbarWrapIndex < settings.toolbarItems.length - 1 ? (
          <Button
            iconId="more"
            tooltip={toolbar.toolMore}
            onClick={() => {
              if (moreItemsOpen) {
                setMoreItems(null);
              } else {
                setMoreItems(
                  settings.toolbarItems
                    .slice(toolbarWrapIndex + 1)
                    .map((name, i) => getToolbarItem(name, i))
                );
              }
            }}
          />
        ) : null}
      </div>
    </header>
  );
};

export default Toolbar;
