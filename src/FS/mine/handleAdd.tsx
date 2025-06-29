import NumberInput from './NumberInput.tsx'
import TextInput from './TextInput.tsx'
import CheckBox from './CheckBox.tsx'
import DrawDownSelection from './DrawDown.tsx'
import { getColNames, excelColumnToIndex, getValueGrid } from './utilities.tsx'
import MyGuiVar from './myGuiVar.tsx'

function handleAdd(
    data: any[][], // the spreadsheet data in 2d array
   showDialog: (
         content: string | React.ReactNode,
               type?: "ok" | "yesno",
                     onOk?: () => void ,
                               onCancel?: () => void 
   )=>void,
){
       let alpha=new MyGuiVar(0.05);
       let eventCNT=new MyGuiVar(0);
       let sampleSize=new MyGuiVar(0);
       let exclRow1=new MyGuiVar(false);
       let selectCol=new MyGuiVar("");
       let eventName=new MyGuiVar("");
       
       // function colSum(){
       //     console.log("selected col",drawdown2.value)
       //     const colSelect=excelColumnToIndex(drawdown2.value as string);
       //     console.log("col index",colSelect);
       //     if (colSelect===null || colSelect<0 ) return;
       //     const arr=getMultiColNum(data,[colSelect] , exclRow1.value as boolean )
       //     console.log(arr)
       //     return arr[0].reduce((acc, curr) => acc + curr, 0);
       // }

       function zzzTest(){
           let sampleProp = 0;
           if (eventCNT.value >= 0 && sampleSize.value >= 1){
                sampleProp = (eventCNT.value)/(sampleSize.value);
            }
            else{
                if (selectCol.value === "" || eventName.value === ""){
                    return (
                        <div>
                        <p>error cant run test</p>
                        </div>
                                  )
                   }
           const colSelect=excelColumnToIndex(selectCol.value as string);
           // console.log("col index",colSelect);
           if (colSelect === null || colSelect < 0 )
               { return (
               <div>
                <p>error on colselect</p>
               </div>
               )
               }
           const arr=getValueGrid(data);
           // const arr=getMultiColNum(data,[colSelect] , exclRow1.value as boolean )
           console.log(arr)
           // return arr[0].reduce((acc, curr) => acc + curr, 0);
          let cnt = 0;
          let validcnt =0;
         for (let i = 0; i < arr.length; i++){
            if (arr[i][colSelect] != null && arr[i][colSelect].toString() != ""){
                validcnt++;
                if (arr[i][colSelect].toString() === eventName.value.toString()){
                    cnt++;
                }
             }
         }
         console.log(cnt);
         console.log(validcnt);
         sampleProp = cnt/validcnt;
            }
            return(
                <div>
                <p>sample prop = {sampleProp}</p>
                </div>
            )
       }

       
       function onClick(){
           console.log(exclRow1.value)
           return (
               <div className="textboxs">
               <p>Got alpha value is {alpha.value}.</p>
               <p>Inputed event cnt is "{eventCNT.value}".</p>
               <p>inputed sample size {sampleSize.value} </p>
               <p>exclude row 1 {exclRow1.value.toString()}.</p>
               <p>the selected column = {selectCol.value} </p>
               <p> the event name = {eventName.value} </p>
               </div>
           )
       }

       showDialog(
           (
         <div>
                <h3>One Sample Poooop </h3>
                <NumberInput variable={alpha} textLabel="Alpha: " step="0.1" />
                <CheckBox variable={exclRow1} textLabel="Exclude the frist Row"  /> 
                <DrawDownSelection variable= {selectCol}
                                    options={getColNames(data)} textLabel="Select a column: " width={100} />
                <TextInput variable={eventName} textLabel="event name "  />

                <NumberInput variable={eventCNT} textLabel="event cnt override" step="1" />
                <NumberInput variable={sampleSize} textLabel="sample cnt override" step="1" />

         </div>
       ), // above is the dialog content
       "yesno", // the type of dialog yesno or ok
        ()=>{showDialog(zzzTest() ,"ok")} // CAll back function when "OK" clicked.
                )
   }

export default handleAdd


