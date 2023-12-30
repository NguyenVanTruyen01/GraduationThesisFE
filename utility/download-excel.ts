import { downloadExcel } from "react-export-table-to-excel"


export function handleDownloadExcel(Leader_Core_Export:string[], excel:any) {
    downloadExcel({
        fileName: "react-export-table-to-excel -> downloadExcel method",
        sheet: "react-export-table-to-excel",
        tablePayload: {
            header :Leader_Core_Export,
            body: excel ,
        },
    })
}
