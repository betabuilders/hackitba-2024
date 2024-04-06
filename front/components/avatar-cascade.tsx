import { cn } from "@/lib/utils";
import { Avatar } from "./ui/avatar";

export default function AvatarCascade({ imageSources, className } : { imageSources: string[], className?: string }) {
    const over = Math.max(imageSources.length - 4, 0);
    if (over == 0) {
        return <div className={"flex -space-x-2 overflow-hidden p-1"}>
            {imageSources.map((url, i) => <Avatar key={i} className="inline-block h-10 w-10 rounded-full">
                <img key={i} src={url}/>
            </Avatar>)}
        </div>
    }

    return  (<div className={"flex -space-x-2 overflow-hidden p-1"}>
        {
            [imageSources[0], over, ...imageSources.slice(imageSources.length - over + 1)].map((url, i) => {
                if (typeof url == 'string')
                    return <Avatar key={i} className={cn("inline-block h-10 w-10 rounded-full", className)}>
                        <img key={i} src={url}/>
                    </Avatar>
                return <Avatar key={'over-the-limit-avatars'} className={cn("flex justify-center items-center h-10 w-10 rounded-full bg-background/20 backdrop-blur-md outline outline-1 -outline-offset-1", className)}>
                    <div className="size-full text-center align-middle h-fit text-sm">+{over}</div>
                </Avatar>
            }
        )}
    </div>)
}