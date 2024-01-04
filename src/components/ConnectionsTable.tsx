import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { FC, useMemo } from "react";
import { GenericTable } from "./GenericTable";
import { ScrollArea } from "./ui/scroll-area";

type RowData = any;

export const ConnectionsTable: FC<{ connectionsData: any }> = ({ connectionsData }) => {

    const columns: ColumnDef<RowData>[] = useMemo(
        () => [
            {
                header: "Id",
                accessorKey: "id",
            },
            {
                header: "Remote Address",
                cell: ({ row }) => { return (<div className="text-wrap">{row.original.remoteAddr}</div>) },
            },
            {
                header: "Remote Peer",
                cell: ({ row }) => { return (`${row.original.remotePeer}`.substring(0, 32) + "...") },
            },
            {
                header: "Direction",
                accessorKey: "direction",
            },
            {
                header: "Timeline",
                cell: ({ row }) => { return (`${JSON.stringify(row.original.timeline)}`) },
            },
            {
                header: "Multiplexer",
                accessorKey: "multiplexer",
            },
            {
                header: "Encryption",
                accessorKey: "encryption",
            },
            {
                header: "Status",
                accessorKey: "status",
            },
            {
                header: "Transient",
                accessorKey: "transient",
            },
            {
                header: "Tags",
                cell: ({ row }) => { return (`${JSON.stringify(row.original.tags)}`) },
            },

        ],
        [],
    );

    const table = useReactTable({
        columns,
        data: connectionsData || [],
        getCoreRowModel: getCoreRowModel(),
    });

    return (

        <div className="rounded-md border m-2">
            {table &&

                <ScrollArea className="h-48" >
                    <GenericTable table={table} columns={columns} />
                </ScrollArea>}
        </div>
    )
}