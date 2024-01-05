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
                        if (typeof data === "object") return (< ReactJson src={data} theme="monokai" />)
                        else return data;
                    }

                    return (tryGetData(row.original.data))
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
                <ScrollArea className="h-96" >
                    <GenericTable table={table} columns={columns} />
                </ScrollArea>)}
        </div>
    )
}