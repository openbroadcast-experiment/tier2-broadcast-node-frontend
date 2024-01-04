import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { FC, useMemo } from "react";
import { GenericTable } from "./GenericTable";
import { ScrollArea } from "./ui/scroll-area";
import ReactJson from "@microlink/react-json-view";

type RowData = any;

export const EventHistoryTable: FC<{ eventHistoryData: { eventType: string, data: any }[] }> = ({ eventHistoryData }) => {

    const columns: ColumnDef<RowData>[] = useMemo(
        () => [
            {
                header: "Event Type",
                accessorKey: "eventType",
            },
            {
                header: "Data",
                cell: ({ row }) => {
                    const tryGetData = (data: any) => {
                        try { return (< ReactJson src={JSON.parse(data)} theme="monokai" />); }
                        catch (e) { return data; }
                    }
                    const data = `${row.original.data}`
                    console.log("🚀 ~ file: EventHistoryTable.tsx:24 ~ tryGetData ~ data:", data)
                    return (<>{tryGetData(data)}
                    </>
                    )
                },

            },
        ],
        [],
    );

    const table = useReactTable({
        columns,
        data: eventHistoryData === undefined ? [] : eventHistoryData,
        getCoreRowModel: getCoreRowModel(),
    });

    return (

        <div className="rounded-md border m-2">
            {table && (
                <ScrollArea className="h-48" >
                    <GenericTable table={table} columns={columns} />
                </ScrollArea>)}
        </div>
    )
}