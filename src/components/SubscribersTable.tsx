import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { FC, useMemo } from "react";
import { GenericTable } from "./GenericTable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ScrollArea } from "./ui/scroll-area";

type RowData = any;

export const SubscribersTable: FC<{ subscribersData: any }> = ({ subscribersData }) => {

    const columns: ColumnDef<RowData>[] = useMemo(
        () => [
            {
                header: "Name",
                accessorKey: "name",
            },
            {
                header: "Peers",
                cell: ({ row }) => {
                    const peers = `${row.original.peers}`;
                    return (
                        <>{peers &&
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div key={peers} className="text-sm">
                                            {peers.substring(0, 28) + "..."}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {peers}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        }
                        </>
                    )
                },

            },

        ],
        [],
    );

    const table = useReactTable({
        columns,
        data: subscribersData === undefined ? [] : subscribersData,
        getCoreRowModel: getCoreRowModel(),
    });

    return (

        <div className="rounded-md border m-2">
            {table && (
                <ScrollArea className="h-44" >
                    <GenericTable table={table} columns={columns} />
                </ScrollArea>)}
        </div>
    )
}