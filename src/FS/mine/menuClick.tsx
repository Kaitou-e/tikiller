import { Context } from '../core/src/context.ts'
import {useDialog} from '../react/src/hooks/useDialog.tsx'

function handleMyMenuClick(
    ctx: Context, 
    value: (string | null) = null)
    {
        const { showDialog, hideDialog } = useDialog()
        console.log("handle my menu click",value)
        if (!value) return;
        if (value === "mona"){
            showDialog("Mona no Lisa","ok");
        }

    }

export default handleMyMenuClick

    

