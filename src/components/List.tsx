
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FC } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export const List: FC<{ data: string[] }> = ({ data }) => {

    if (data === undefined) return (<></>)
    return (
        <ScrollArea>
            <div className="p-4">
                {data.map((item) => (
                    <>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div key={item} className="text-sm">
                                        {item.substring(0, 28) + "..."}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                {item}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Separator className="my-2" />
                    </>
                ))}
            </div>
        </ScrollArea>
    )
}
