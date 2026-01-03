import { useDialog } from "../react/src/hooks/useDialog.tsx";

function nonTInotice(
    showDialog: (
        isResult: boolean,
        content: string | React.ReactNode,
        type?: "ok" | "yesno",
        onOk?: () => void,
        onCancel?: () => void
    ) => void
) {

    const MenuText = () => (
        <>
            The menu section below contains the functions
            <br />
            follows conventional stat software, like JMP
            <br />
            and Minitab, in the stats terms.
        </>
    );

    showDialog(false,
        <div>
            <h3>Minitab / JMP alike</h3>
            <MenuText />
        </div>,
        "ok"
    );

}

export function TInotice(
    showDialog: (
        isResult: boolean,
        content: string | React.ReactNode,
        type?: "ok" | "yesno",
        onOk?: () => void,
        onCancel?: () => void
    ) => void
) {

    const MenuText = () => (
        <>
            The menu section below contains the functions
            <br />
            replicated from TI Calculator. They use same
            <br />
            terms in result and layouts.
        </>
    );

    showDialog(false,
        <div>
            <h3>TI Calculator Replica</h3>
            <MenuText />
        </div>,
        "ok"
    );

}

export default nonTInotice;