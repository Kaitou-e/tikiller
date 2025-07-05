import SubMenu from "./submenu.tsx";
// import React, { useContext } from "react";
import { useDialog } from "../react/src/hooks/useDialog.tsx";

const SubMenuSan: React.FC<{
        // text:string;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
        // subMenuItems: [];
        // handleSubMenuClicks: (value:string)=>void;
}> = ({ 
    // text,
    setOpen, 
    // subMenuItems, handleSubMenuClicks
}) => {
// function SubMenuSan({
//     setOpen:(status:boolean)=>void,
//         // setOpen: React.Dispatch<React.SetStateAction<boolean>>
// }
// ){
  const { showDialog } = useDialog();

        const  subMenuItems :{ text: string; value: string }[] =          [
                  { text: "greaterThan", value: ">" },
                  { text: "duplicateValue", value: "##" },
                ];
        const handleSubMenuClicks=(value:string)=>{
            if (value===">"){
                showDialog("da yu","ok");
            } else if (value==="##"){
                showDialog("jing jing hao","ok");
            }
        };

                return (<SubMenu text="sub2menu222" setOpen={setOpen} subMenuItems={subMenuItems} handleSubMenuClicks={handleSubMenuClicks} />);

}

export default SubMenuSan;
