import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";

export const CardComponent: FC<{ title: string, children: any, className?: any }> = ({ title, children, className }) => {
    return (
        <Card className={className ?? "m-2 h-72 w-80 rounded-md border"}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>

                {children}
            </CardContent>
        </Card>
        )
}